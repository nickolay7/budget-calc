# Architecture Overview

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      AppModule                              │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  AuthModule   │  │  UsersModule │  │  Other Modules   │  │
│  │              │  │              │  │  (Accounts,       │  │
│  │ AuthService  │  │  Commands ◀──│  │   Categories,     │  │
│  │  ┌─────────┐ │  │  Queries  ◀──│  │   Transactions,   │  │
│  │  │CommandBus│─┼──┼▶ CreateUser  │  │   Budgets)        │  │
│  │  │QueryBus  │─┼──┼▶ GetByEmail  │  │                  │  │
│  │  └─────────┘ │  │  GetById     │  │                  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                 │                                 │
│         ▼                 ▼                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              PrismaService (Global)                  │   │
│  │         PostgreSQL (via Docker Compose)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Key Architectural Decisions

### CQRS (Command Query Responsibility Segregation)
Cross-module communication uses CQRS buses (`CommandBus`, `QueryBus`, `EventBus`) from `@nestjs/cqrs`. No module directly imports another module's service. This keeps the module graph acyclic and makes each module independently testable.

### Global JWT Guard
The `JwtAuthGuard` is registered as a global `APP_GUARD` provider, protecting all routes by default. Routes that should be public (like login and register) use the `@Public()` decorator to opt out.

### Shared Package
Common types, Zod schemas, and utilities live in `@budget-calc/shared`, which is consumed by both `apps/api` and `apps/web` without a build step (raw TypeScript).

## Module Boundaries

| Module | Exposes via CQRS | Accessed by |
|---|---|---|
| Auth | — (only dispatches) | HTTP (login, register, refresh) |
| Users | `CreateUserCommand`, `GetUserByEmailQuery`, `GetUserByIdQuery` | Auth, Users controller |

## Request Lifecycle (Login Example)

```
HTTP POST /api/auth/login
  → JwtAuthGuard (@Public() → skip)
  → AuthController.login(dto)
  → AuthService.login(dto)
    → QueryBus.execute(GetUserByEmailQuery)
      → GetUserByEmailHandler → Prisma → User
    → bcrypt.compare(password, user.password)
    → JwtService.sign({ sub, email })
  ← { accessToken, refreshToken, user }
```
