# Auth API

Base path: `/api/auth`

All auth routes are `@Public()` — no JWT token required.

---

## POST /api/auth/register

Create a new user account and return JWT tokens.

### Request Body

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepass123"
}
```

| Field | Type | Constraints |
|---|---|---|
| `email` | string | Valid email format |
| `name` | string | Min 3 characters |
| `password` | string | Min 6 characters |

### Response `201`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Errors

| Status | Condition |
|---|---|
| `409 Conflict` | Email already in use |

### Flow

```
RegisterDto
  → QueryBus: GetUserByEmailQuery (check duplicate)
  → bcrypt.hash(password, 10)
  → CommandBus: CreateUserCommand (save user)
    → EventBus: UserCreatedEvent
  → JwtService.sign (access + refresh tokens)
  → Response
```

---

## POST /api/auth/login

Authenticate with email and password.

### Request Body

```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

| Field | Type | Constraints |
|---|---|---|
| `email` | string | Valid email |
| `password` | string | — |

### Response `201`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" }
}
```

### Errors

| Status | Condition |
|---|---|
| `401 Unauthorized` | Invalid email or password |

### Flow

```
LoginDto
  → QueryBus: GetUserByEmailQuery
  → bcrypt.compare(password, user.password)
  → JwtService.sign (access + refresh tokens)
  → Response
```

---

## POST /api/auth/refresh

Exchange a refresh token for a new token pair.

### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Response `201`

```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "uuid", "email": "...", "name": "..." }
}
```

### Errors

| Status | Condition |
|---|---|
| `401 Unauthorized` | Invalid or expired refresh token |

### Flow

```
refreshToken
  → JwtService.verify(token, { secret })
  → QueryBus: GetUserByIdQuery
  → JwtService.sign (new token pair)
  → Response
```

---

## Token Configuration

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | `dev-secret-key-change-in-production` | HMAC secret |
| `JWT_EXPIRATION` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRATION` | `7d` | Refresh token lifetime |

### Flow

```
register
  → ValidationPipe: class-validator (email, name min 3, password min 6)
  → QueryBus: GetUserByEmailQuery (check duplicate)
  → bcrypt.hash(password, 10)
  → CommandBus: CreateUserCommand (save user)
    → EventBus: UserCreatedEvent
  → JwtService.sign (access + refresh tokens)
  → AuthResponse { accessToken, refreshToken, user }
```

---

## POST /api/auth/forgot-password

Request a password reset link. Always returns the same message to prevent email enumeration.

### Request Body

```json
{
  "email": "user@example.com"
}
```

| Field | Type | Constraints |
|---|---|---|
| `email` | string | Valid email |

### Response `201`

```json
{
  "message": "If that email exists, a reset link has been sent."
}
```

Security: same response regardless of whether the email exists (no email enumeration).

### Flow

```
ForgotPasswordDto
  → QueryBus: GetUserByEmailQuery (find user)
  → crypto.randomBytes(32).toString('hex') → resetToken
  → Prisma: user.update({ passwordResetToken, passwordResetExpires })
  → console.log(`[DEV] token: ...`)  ← in production, send email
  → { message: "..." }
```

---

## POST /api/auth/reset-password

Set a new password using a reset token.

### Request Body

```json
{
  "token": "a1b2c3d4e5f6...64hexchars",
  "password": "newsecurepass123"
}
```

| Field | Type | Constraints |
|---|---|---|
| `token` | string | Required |
| `password` | string | Min 6 characters |

### Response `200`

```json
{
  "message": "Password has been reset successfully."
}
```

### Errors

| Status | Condition |
|---|---|
| `400 Bad Request` | Invalid or expired reset token |

### Flow

```
ResetPasswordDto
  → Prisma: user.findFirst({ passwordResetToken, passwordResetExpires > now })
  → bcrypt.hash(password, 10)
  → Prisma: user.update({ password, passwordResetToken: null, passwordResetExpires: null })
  → { message: "..." }
```

---

## Token Configuration

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | `dev-secret-key-change-in-production` | HMAC secret |
| `JWT_EXPIRATION` | `15m` | Access token lifetime |
| `JWT_REFRESH_EXPIRATION` | `7d` | Refresh token lifetime |

### JWT Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1700000000,
  "exp": 1700000900
}
```
