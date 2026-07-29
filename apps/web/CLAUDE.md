# CLAUDE.md — apps/web (Next.js frontend)

## Commands

```bash
npm run dev -w @budget-calc/web   # dev server on :3000
```

## Frontend routes

Two route groups in `apps/web/src/app/`:

| Group | Routes | Purpose |
|---|---|---|
| `(auth)` | `/login`, `/register`, `/forgot-password`, `/reset-password` | Public (no sidebar) |
| `(dashboard)` | `/`, `/transactions`, `/categories`, `/budgets`, `/accounts`, `/settings` | Authenticated (with AppShell + sidebar) |

Middleware (`middleware.ts`) protects all routes except public ones. Reads `budget_calc_token` cookie. Redirects unauthenticated → `/login?redirect=<path>`. Redirects authenticated on auth pages → `/`.

## Frontend architecture (FSD — Feature-Sliced Design)

```
src/
├── shared/          # (layer: shared) Reusable utilities
│   ├── ui/         # shadcn/ui components (button, input, label, card)
│   └── api/        # api-client.ts — generic fetch + token storage
├── entities/        # (layer: entities) Business entities
│   ├── auth/       # useAuthStore (Zustand)
│   └── transactions/
├── features/        # (layer: features) User interactions
│   ├── auth/ui/    # LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm
│   ├── dashboard/  # Dashboard components (ui/, lib/)
│   └── transactions/ui/
├── components/      # Shared layout components
│   └── layout/     # app-shell.tsx, sidebar.tsx (client component)
├── app/             # (layer: app) Next.js App Router pages
│   ├── (auth)/     # Public auth pages
│   ├── (dashboard)/ # Protected pages with AppShell
│   └── providers/  # AuthProvider (client)
├── styles/          # Global CSS (Tailwind v4 + shadcn theme)
└── middleware.ts    # Route protection (edge runtime)
```

**FSD layer imports rule**: `shared` → `entities` → `features` → `app` (`app/`). Code in a layer cannot import from a higher layer. Within `app/`, pages import from `features/`, `entities/`, `shared/`.

## Auth frontend flow

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

### Token storage

Access token in both `localStorage` (`budget_calc_access_token`) and cookie (`budget_calc_token`). Cookie enables middleware auth checks. Refresh token in `localStorage` only (`budget_calc_refresh_token`).

## Password reset flow (frontend)

1. ForgotPasswordForm (email only) → POST `/api/auth/forgot-password`
2. User clicks reset link → ResetPasswordForm reads `?token=` from URL (`useSearchParams`, wrap in `<Suspense>`)
3. POST `/api/auth/reset-password` with token + new password

## API client

`apps/web/src/shared/api/api-client.ts` — two factories:
- `apiClient()` — adds `Authorization: Bearer` from localStorage. Use for authenticated requests.
- `publicClient()` — no auth. Use for login, register, forgot/reset.
- `setTokens(access, refresh)` / `clearTokens()` — token storage helpers.
- `getAccessToken()` — reads token from localStorage (returns `null` on server).

Import shared types from `@budget-calc/shared` for type safety.

## Zustand stores

- No providers needed — `create` from `zustand`, call `useXxxStore(selector)` directly in components.
- Example: `useAuthStore` in `entities/auth/store.ts` — has `user`, `isAuthenticated`, `isLoading`, `error` state.

## UI components

- shadcn/ui primitives in `shared/ui/` (Tailwind v4, oklch colors, cva variants).
- Domain-specific components in `features/<entity>/ui/`.

## Forms

- Zod schema from `@budget-calc/shared/validation` via `.safeParse()` for validation.
- Display errors per field from Zod error details.

## New route page

- Wrap `useSearchParams` in `<Suspense>` boundary.
