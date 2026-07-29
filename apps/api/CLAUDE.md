# CLAUDE.md — apps/api (NestJS backend)

## Commands

```bash
# Development
npm run dev -w @budget-calc/api   # dev server on :3001

# Database
npm run compose:up     # Start PostgreSQL (Docker Compose in docker/)
npm run compose:down   # Stop PostgreSQL
npm run db:migrate     # Prisma migrate dev
npm run db:generate    # Prisma generate
npm run db:studio      # Prisma Studio
npm run db:seed        # Run seed
```

## Database (PostgreSQL via Docker Compose)

```prisma
User ──┬── Account      (one user → many accounts)
       ├── Category     (one user → many categories; name+userId unique)
       ├── Transaction  (payer; can have source/destination accounts for transfers)
       └── Budget       (per category per period)
```

- `AccountType`: `CASH | DEBIT_CARD | CREDIT_CARD | SAVINGS | ELECTRONIC`
- `TransactionType`: `INCOME | EXPENSE | TRANSFER`
- Schema at `apps/api/prisma/schema.prisma` — all IDs are UUIDs, monetary values are `Decimal(12,2)`.

## Backend modules (`apps/api/src/modules/`)

Two patterns exist:

### Standard pattern (Accounts, Transactions, Budgets)

`module.ts` + `controller.ts` + `service.ts` + `dto/`. Used for simpler CRUD.

### CQRS pattern (Users, Categories)

Uses `@nestjs/cqrs` — `CommandBus` / `QueryBus` + separate handlers. See structure:
- `users/`: commands/, events/, handlers/, queries/
- `categories/`: commands/, events/, handlers/, queries/

| Module | Key routes | Pattern | Purpose |
|---|---|---|---|
| Auth | POST /auth/register, /login, /refresh, /forgot-password, /reset-password | Service | JWT (access + refresh) + password reset |
| Users | GET/PATCH /users/me | CQRS | Profile |
| Accounts | CRUD /accounts | Standard | Financial accounts |
| Categories | CRUD /categories | CQRS | Expense categories |
| Transactions | CRUD /transactions, GET /stats | Standard | Transactions + aggregation |
| Budgets | CRUD /budgets, GET /progress | Standard | Budget vs actual |

## Global providers

| Provider | File | Purpose |
|---|---|---|
| `PrismaService` | `prisma/prisma.service.ts` | Database access |
| `JwtAuthGuard` | `common/guards/jwt-auth.guard.ts` | Global JWT guard — checks `@Public()` decorator to opt out |
| `TransformInterceptor` | `common/interceptors/transform.interceptor.ts` | Wraps responses in standard envelope |
| `HttpExceptionFilter` | `common/filters/http-exception.filter.ts` | Global exception handling |
| `ValidationPipe` | `main.ts` — global | whitelist: true, transform: true, forbidNonWhitelisted: true |

## Auth flow (backend)

```
@Controller("auth") — all routes @Public()
  → AuthService:
    → register: check uniqueness → hash password (bcryptjs, 10 rounds) → CreateUserCommand → generateTokens (JWT)
    → login: GetUserByEmailQuery → verify bcrypt → generateTokens
    → refresh: verify JWT → GetUserByIdQuery → generateTokens
    → forgotPassword: GetUserByEmailQuery → crypto.randomBytes(32) → store hash + 1hr expiry → anti-enumeration
    → resetPassword: find by token + check expiry → hash + update user → clear token

JwtStrategy (passport-jwt):
  → ExtractJwt.fromAuthHeaderAsBearerToken()
  → validate(payload.sub) → findUnique User → return { id, email, name }
```

## Decorators

| Decorator | File | Usage |
|---|---|---|
| `@Public()` | `common/decorators/public.decorator.ts` | Skip JWT auth on a route |
| `@CurrentUser()` | `common/decorators/current-user.decorator.ts` | Extract user from JWT payload. `@CurrentUser("id")` returns specific field |

## DTO patterns

- **Backend**: `class-validator` + `class-transformer` decorators in `<module>/dto/` — validated by global `ValidationPipe`.
- **Shared** (cross-platform): Zod schemas in `packages/shared/src/validation/` — can re-validate on the frontend.
- When adding a DTO, add both: NestJS class-validator DTO and shared Zod schema.

## Shared package (`@budget-calc/shared`)

Raw TypeScript — no build step. Re-exported from `src/index.ts`:

- **types/** — Interfaces for each domain entity + API response/pagination wrappers + DTO types
- **validation/** — Zod schemas mirroring the backend class-validator DTOs
- **constants/** — `TRANSACTION_TYPES`, `ACCOUNT_TYPES`, `BUDGET_PERIODS`, `PAGINATION` defaults
- **utils/** — `formatCurrency`, `formatDate`, `getPeriodDates`, `calculateBudgetProgress`
