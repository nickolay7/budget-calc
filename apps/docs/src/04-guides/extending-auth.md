# Guide: Extending Auth

## Adding OAuth / Social Login

To add social login (Google, GitHub, etc.):

1. **Install passport strategy**: `passport-google-oauth20`, `passport-github`, etc.
2. **Create strategy**: `auth/strategies/google.strategy.ts` extending `PassportStrategy`
3. **Add route**: `GET /api/auth/google` with `@Public()` and `@UseGuards(AuthGuard('google'))`
4. **Handle callback**: After OAuth, upsert user via CQRS
5. **Generate tokens**: Call `AuthService.generateTokens()` (currently private — make it public if needed)

## Adding Roles (RBAC)

1. **Add `role` field** to Prisma User model
2. **Create enum/shared type**: `enum Role { USER, ADMIN }`
3. **Create `RolesGuard`** that checks `req.user.role`
4. **Create `@Roles()` decorator** that sets role metadata
5. **Compose guards** in controller: `@UseGuards(JwtAuthGuard, RolesGuard)`
6. **Add role to JWT payload** in `AuthService.generateTokens()`

## Password Reset Flow

1. **Create `RequestResetCommand`** → generates token, sends email
2. **Create `ResetPasswordCommand`** → validates token, updates hash
3. Both handlers live in Users module
4. Auth dispatches via `CommandBus`
5. Add `@Public()` routes: `POST /api/auth/request-reset`, `POST /api/auth/reset-password`

## Making generateTokens Public

Currently `generateTokens()` is private. If another module needs to issue tokens (e.g., after OAuth):

```typescript
// In AuthService
async issueTokens(userId: string, email: string) {
  return this.generateTokens({ id: userId, email });
}
```

Then dispatch from elsewhere:
```typescript
const tokens = await this.commandBus.execute(
  new IssueTokensCommand(userId, email),
);
```
