# Documentation Home

## Purpose

This documentation describes the **CQRS-based JWT authentication system** added to the Budget Calc API. It covers the architecture, API endpoints, module structure, and development guides.

## What Changed

| Area | Change |
|---|---|
| **Dependencies** | Added `@nestjs/cqrs` for CQRS-based inter-module communication |
| **Prisma** | User model already existed — no schema changes needed |
| **User Module** | Added CQRS commands, queries, events, handlers. Removed direct service layer. |
| **Auth Module** | Replaced stubs with real logic: bcrypt hashing, JWT signing, CQRS dispatch. |
| **App Module** | Added `CqrsModule.forRoot()` and global `JwtAuthGuard`. |
| **Shared Package** | Added `AuthResponse`, `LoginDto` types and `loginSchema`. |
| **Categories Module** | Rewritten with CQRS: commands, queries, handlers, events. Added cross-module user verification. Ownership checks on all operations. Improved DTO validation with `@IsNotEmpty` and hex color `@Matches`. |
| **Auth Module** | Added password recovery flow: `forgot-password` + `reset-password` endpoints. `passwordResetToken` and `passwordResetExpires` fields in User model. `PrismaService` injection for direct DB operations. |
| **Frontend Auth** | New FSD-based structure: `shared/ui/` (shadcn components), `entities/auth/` (zustand store), `features/auth/ui/` (forms). Tailwind v4 theming with shadcn CSS variables. |

## Principles

- **No direct imports** between Auth and User modules
- **Only CQRS buses** cross module boundaries
- **Handlers live in the owning module** — Auth only dispatches commands/queries
- **Global JWT guard** with `@Public()` opt-out for open routes
