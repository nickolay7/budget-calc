# Categories Module

> Location: `apps/api/src/modules/categories/`

## Purpose

Manage expense categories for users. Exposes CQRS handlers for CRUD operations and a controller for category endpoints. Interacts with the Users module via CQRS to verify user existence.

## File Tree

```
categories/
├── commands/
│   ├── create-category.command.ts      ← CreateCategoryCommand
│   ├── update-category.command.ts      ← UpdateCategoryCommand
│   └── delete-category.command.ts      ← DeleteCategoryCommand
├── queries/
│   ├── get-categories.query.ts         ← GetCategoriesQuery
│   └── get-category-by-id.query.ts     ← GetCategoryByIdQuery
├── handlers/
│   ├── create-category.handler.ts      ← @CommandHandler
│   ├── update-category.handler.ts      ← @CommandHandler
│   ├── delete-category.handler.ts      ← @CommandHandler
│   ├── get-categories.handler.ts       ← @QueryHandler
│   └── get-category-by-id.handler.ts   ← @QueryHandler
├── events/
│   ├── category-created.event.ts       ← CategoryCreatedEvent
│   ├── category-updated.event.ts       ← CategoryUpdatedEvent
│   └── category-deleted.event.ts       ← CategoryDeletedEvent
├── dto/
│   ├── create-category.dto.ts          ← class-validator
│   └── update-category.dto.ts          ← class-validator
├── categories.controller.ts           ← HTTP routes (uses QueryBus + CommandBus)
└── categories.module.ts               ← Module definition
```

## Data Ownership

Every operation is scoped to the authenticated user:

- `findAll` — returns only the current user's categories
- `findOne` — returns 404 if the category belongs to another user
- `create` — verifies the user exists via `GetUserByIdQuery`, then creates
- `update` — only updates if the category belongs to the current user
- `remove` — only deletes if the category belongs to the current user

## CQRS Flow

### Creating a Category

```
POST /api/categories
  → CategoriesController.create(userId, dto)
  → commandBus.execute(CreateCategoryCommand)
  → CreateCategoryHandler.execute()
      → queryBus.execute(GetUserByIdQuery(userId))    ← cross-module CQRS
      → prisma.category.create(...)
      → eventBus.publish(CategoryCreatedEvent)
      → return category
```

### Cross-Module Interaction

```
CreateCategoryHandler             UsersModule
  │                                 │
  └─queryBus.execute(───────────────┼─GetUserByIdQuery)
        GetUserByIdQuery)           │   → prisma.user.findUnique({ where: { id } })
                                    │   → returns user
```

## DTO Validation

| Field | Rule | Error Message |
|-------|------|--------------|
| `name` | `@IsString()` + `@IsNotEmpty()` | `"name should not be empty"` |
| `icon` | `@IsOptional()` + `@IsString()` | — |
| `color` | `@IsOptional()` + `@Matches(/^#[0-9a-fA-F]{6}$/)` | `"color must be a valid hex color (e.g. #FF0000)"` |

## Module Definition

```typescript
@Module({
  imports: [CqrsModule],
  controllers: [CategoriesController],
  providers: [
    GetCategoriesHandler,
    GetCategoryByIdHandler,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
  ],
})
export class CategoriesModule {}
```

## Events

| Event | Payload | Published When |
|-------|---------|---------------|
| `CategoryCreatedEvent` | `{ categoryId, userId, name }` | After successful creation |
| `CategoryUpdatedEvent` | `{ categoryId, userId, name }` | After successful update |
| `CategoryDeletedEvent` | `{ categoryId, userId }` | After successful deletion |

No event handlers are registered yet — events are available for future cross-module reactions.
