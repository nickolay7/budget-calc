# Users Module

> Location: `apps/api/src/modules/users/`

## Purpose

Manage user entities. Exposes CQRS handlers for cross-module operations and a controller for user profile endpoints.

## File Tree

```
users/
├── commands/
│   └── create-user.command.ts        ← CreateUserCommand
├── queries/
│   ├── get-user-by-email.query.ts    ← GetUserByEmailQuery
│   └── get-user-by-id.query.ts       ← GetUserByIdQuery
├── handlers/
│   ├── create-user.handler.ts        ← @CommandHandler
│   ├── get-user-by-email.handler.ts  ← @QueryHandler
│   └── get-user-by-id.handler.ts     ← @QueryHandler
├── events/
│   └── user-created.event.ts         ← UserCreatedEvent
├── dto/
│   ├── create-user.dto.ts            ← class-validator
│   └── update-user.dto.ts            ← class-validator
├── users.controller.ts              ← HTTP routes (uses QueryBus)
└── users.module.ts                  ← Module definition
```

## CQRS Handlers

### CreateUserHandler

| Aspect | Detail |
|---|---|
| Trigger | `CreateUserCommand` (from AuthService) |
| Action | `prisma.user.create()` with hashed password |
| Return | `{ id, email, name, createdAt }` — no password |
| Event | Publishes `UserCreatedEvent` |

### GetUserByEmailHandler

| Aspect | Detail |
|---|---|
| Trigger | `GetUserByEmailQuery` (from AuthService — login) |
| Action | `prisma.user.findUnique({ where: { email } })` |
| Return | Full user **including password** (needed for bcrypt compare) |

### GetUserByIdHandler

| Aspect | Detail |
|---|---|
| Trigger | `GetUserByIdQuery` (from AuthService — refresh, or UsersController — profile) |
| Action | `prisma.user.findUnique({ where: { id }, select: { id, email, name, createdAt } })` |
| Return | `{ id, email, name, createdAt }` — **no password** |

## UsersController Routes

| Method | Path | Auth | Action |
|---|---|---|---|
| GET | /api/users/me | JWT required | `GetUserByIdQuery(userId)` |
| PATCH | /api/users/me | JWT required | Placeholder (returns current profile) |

## Module Definition

```typescript
@Module({
  imports: [CqrsModule],                              // handler registration
  controllers: [UsersController],
  providers: [CreateUserHandler, GetUserByEmailHandler, GetUserByIdHandler],
  // Exports: [] — nothing exported, only CQRS
})
export class UsersModule {}
```

## Data Security: Password Never Leaks

- `GetUserByIdHandler` explicitly selects fields, **excluding** `password`
- `CreateUserHandler` also selects specific fields, never returning the hash
- Only `GetUserByEmailHandler` returns the password hash — and it's only used by AuthService's login flow for `bcrypt.compare()`
