# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (parallel frontend + backend)
npm run dev

# Start/stop PostgreSQL
npm run compose:up
npm run compose:down

# Database
npm run db:migrate    # Prisma migrate dev
npm run db:generate   # Prisma generate
npm run db:studio     # Prisma Studio
npm run db:seed       # Run seed

# Per-workspace (when you need just one)
npm run dev -w @budget-calc/web
npm run dev -w @budget-calc/api

# Other
npm run build
npm run lint
npm run format
```

## Architecture

Monorepo with npm workspaces. Three workspaces: `apps/*`, `packages/*`, `tooling/*`.

```
apps/web     — Next.js 16 (App Router) — port 3000
apps/api     — NestJS 11 + Prisma 6 — port 3001, API prefix: /api
packages/shared — Shared types, Zod schemas, constants, utils
```

### Database (PostgreSQL via Docker Compose in `docker/`)

5 Prisma models with `User` as the root entity:

```
User ──┬── Account      (one user → many accounts)
       ├── Category     (one user → many categories; name+userId unique)
       ├── Transaction  (payer; can have source/destination accounts for transfers)
       └── Budget       (per category per period)
```

AccountType: `CASH | DEBIT_CARD | CREDIT_CARD | SAVINGS | ELECTRONIC`
TransactionType: `INCOME | EXPENSE | TRANSFER`

### Backend modules (`apps/api/src/modules/`)

Each module follows NestJS convention: `module.ts` + `controller.ts` + `service.ts` + `dto/`. Every controller is JWT-guarded by default; use `@Public()` decorator to opt out.

| Module | Key routes | Purpose |
|---|---|---|
| Auth | POST /auth/register, /login, /refresh, /forgot-password, /reset-password | JWT (access + refresh) + password reset |
| Users | GET/PATCH /users/me | Profile |
| Accounts | CRUD /accounts | Financial accounts |
| Categories | CRUD /categories | Expense categories |
| Transactions | CRUD /transactions, GET /stats | Transactions + aggregation |
| Budgets | CRUD /budgets, GET /progress | Budget vs actual |

Global providers: `PrismaService`, `JwtAuthGuard`, `TransformInterceptor`, global `ValidationPipe` (class-validator).

### Frontend routes (`apps/web/src/app/`)

Two route groups:

| Group | Routes | Purpose |
|---|---|---|
| `(auth)` | `/login`, `/register`, `/forgot-password`, `/reset-password` | Public (no sidebar) |
| `(dashboard)` | `/`, `/transactions`, `/categories`, `/budgets`, `/accounts`, `/settings` | Authenticated (with AppShell + sidebar) |

Middleware (`middleware.ts`) protects all routes except public ones. Reads `budget_calc_token` cookie. Redirects unauthenticated → `/login?redirect=<path>`. Redirects authenticated on auth pages → `/`.

### Frontend architecture (FSD — Feature-Sliced Design)

```
src/
├── shared/          # (layer: shared) Reusable utilities
│   ├── ui/         # shadcn/ui components (button, input, label, card)
│   └── api/        # api-client.ts — generic fetch + token storage
├── entities/        # (layer: entities) Business entities
│   └── auth/
│       └── store.ts # Zustand store (login, register, logout, checkAuth)
├── features/        # (layer: features) User interactions
│   └── auth/
│       └── ui/     # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
├── components/      # Shared layout components
│   └── layout/
│       ├── app-shell.tsx  # Sidebar + main content wrapper
│       └── sidebar.tsx    # Navigation + logout (client component)
├── app/             # (layer: app) Next.js App Router pages
│   ├── (auth)/      # Public auth pages
│   ├── (dashboard)/ # Protected pages with AppShell
│   └── providers/   # AuthProvider (client)
├── styles/          # Global CSS (Tailwind v4 + shadcn theme)
└── middleware.ts     # Route protection
```

**FSD layer imports rule**: `shared` → `entities` → `features` → `app` (`app/`). Code in a layer cannot import from a higher layer. Within `app/`, pages import from `features/`, `entities/`, `shared/`.

### Auth frontend flow

```
LoginForm (features/auth/ui)
  → Zustand store.login() (entities/auth)
    → api-client.ts post(/api/auth/login)
    → setTokens(access, refresh) — localStorage + cookie
  → router.push() redirect

Middleware (edge runtime)
  → reads budget_calc_token cookie
  → redirects unauthenticated to /login

AuthProvider (app/providers)
  → checkAuth() on mount → GET /api/users/me
  → doesn't block rendering

Logout (sidebar)
  → store.logout() → clearTokens() + router.push(/login)
```

**Token storage**: Access token stored in both `localStorage` (`budget_calc_access_token`) and cookie (`budget_calc_token`). Cookie enables middleware (edge runtime) auth checks. Refresh token in `localStorage` only (`budget_calc_refresh_token`).

### Password reset flow

1. User fills ForgotPasswordForm (email only) → POST `/api/auth/forgot-password`
2. Backend generates `crypto.randomBytes(32)` token, stores with `passwordResetToken` + `passwordResetExpires` (1hr)
3. Anti-enumeration: always returns same message regardless of whether email exists
4. User clicks reset link → ResetPasswordForm reads `?token=` from URL (useSearchParams, Suspense-wrapped)
5. POST `/api/auth/reset-password` with token + new password → backend hashes + clears token

### Shared package (`@budget-calc/shared`)

Raw TypeScript — no build step. Exports:
- **types/**: Interfaces for each domain entity + API response/pagination wrappers + DTO types
- **validation/**: Zod schemas mirroring the backend class-validator DTOs (both client and server can import)
- **constants/**: Enums (TRANSACTION_TYPES, ACCOUNT_TYPES, BUDGET_PERIODS), pagination defaults
- **utils/**: formatCurrency, formatDate, getPeriodDates, calculateBudgetProgress

## Branch workflow (GitHub Flow)

We follow [GitHub Flow](https://guides.github.com/introduction/flow/):

| Rule | Description |
|---|---|
| `main` is always deployable | Never commit broken or unfinished work directly to `main` |
| Branch off `main` | Every feature, fix, or change gets its own branch from `main` |
| Branch naming | Use conventional-commit prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `style/`, `test/`, `perf/` — e.g. `feat/main-screen`, `fix/login-error` |
| Open a PR | Every branch → pull request into `main`, even for solo work |
| PR description | Link to the task/issue, summarise what and why, note any manual testing done |
| Merge via PR | Use **Squash and merge** for feature branches — keeps `main` history clean |
| Delete after merge | Delete the feature branch immediately after merging |
| Keep it short-lived | Feature branches should live hours or days, not weeks. Large features → break into smaller incremental PRs |
| Rebase before PR | `git rebase main` before opening the PR to avoid conflicts |

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
|---|---|
| `feat:` | New feature for the user or backend endpoint |
| `fix:` | Bug fix |
| `chore:` | Tooling, configs, dependencies, CI, project setup |
| `docs:` | Documentation-only changes (README, CLAUDE.md, JSDoc) |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `style:` | Formatting, missing semicolons, lint fixes (no logic change) |
| `test:` | Adding or correcting tests |
| `perf:` | Performance improvement |

**Format**: `<type>[(scope)]: <short summary>`

- Scope is optional — use a noun like `api`, `web`, `shared`, `docs`, `docker`.
- Summary starts lowercase, no period, imperative mood.
- Separate body from subject with a blank line. Use body to explain *why*.
- Footer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` when Claude Code contributed.

**Examples**:
```
feat(api): add category CRUD endpoints
fix(web): handle empty transaction list gracefully
chore: configure ESLint for monorepo
docs: document auth flow in CLAUDE.md
```

## Patterns to follow

- **Adding a new entity**: create Prisma model → NestJS module (controller+service+dto) → shared types + Zod schema → Next.js route + component
- **DTOs** use `class-validator` decorators on the backend, `zod` schemas in shared (re-validate on frontend forms)
- **API client** in `apps/web/src/shared/api/api-client.ts` — generic fetch wrapper with `apiClient()` (auth) and `publicClient()` (no auth). Import shared types for type safety.
- **New frontend feature**: create Zod schema in `@budget-calc/shared/validation` → form component in `features/<entity>/ui/` → page in `app/(dashboard)/<entity>/` → store in `entities/<entity>/` if needed
- **Auth flow**: `@CurrentUser()` param decorator extracts user from JWT payload; `@Public()` decorator skips guard
- **UI components**: shadcn/ui in `shared/ui/` (Tailwind v4, oklch colors, cva variants), domain components in `features/<entity>/ui/`
- **Zustand stores**: no providers needed — `create` from `zustand`, call `useXxxStore(selector)` directly in components
- **Forms**: Zod schema via `.safeParse()` for validation, display errors per field
- **New route page**: wrap `useSearchParams` in `<Suspense>` boundary

## Voice Mode (voice-cc)
     - Wrap your end-of-turn summary in `<say>...</say>` tags.
     - Make the summary stand alone — no references to "this response".
     - Aim for one sentence. Omit if no useful audio summary.