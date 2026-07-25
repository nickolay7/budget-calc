# Users API

Base path: `/api/users`

All users routes are **JWT-protected** (require `Authorization: Bearer <accessToken>`).

---

## GET /api/users/me

Get the authenticated user's profile.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response `200`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2026-07-20T10:00:00.000Z"
}
```

Note: `password` is never returned.

### Flow

```
JwtAuthGuard.validate (extracts user from token)
  → @CurrentUser("id") → userId
  → QueryBus: GetUserByIdQuery(userId)
  → Prisma: user.findUnique({ where: { id }, select: { id, email, name, createdAt } })
  → Response
```

---

## PATCH /api/users/me

Update profile (placeholder — not fully implemented).

### Request Body

```json
{
  "email": "newemail@example.com",
  "name": "New Name"
}
```

| Field | Type | Required |
|---|---|---|
| `email` | string | Optional |
| `name` | string | Optional |

### Response `200`

Returns current user profile (unchanged until update command is implemented).

---

## Guard Behavior

The `JwtAuthGuard` is registered globally. The `@CurrentUser()` decorator extracts the user from the validated JWT payload:

```typescript
// Parameter decorator in controller
@Get("me")
getProfile(@CurrentUser("id") userId: string) { ... }

// The decorator supports:
@CurrentUser()       // → full user object { id, email, name }
@CurrentUser("id")   // → user.id only
@CurrentUser("email")// → user.email only
```
