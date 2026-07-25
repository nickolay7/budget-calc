# Categories API

Base path: `/api/categories`

All categories routes are **JWT-protected** (require `Authorization: Bearer <accessToken>`).

---

## GET /api/categories

Get all categories for the authenticated user.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response `200`

```json
[
  {
    "id": "uuid",
    "name": "Groceries",
    "icon": "🛒",
    "color": "#FF6B6B",
    "userId": "uuid",
    "createdAt": "2026-07-20T10:00:00.000Z",
    "updatedAt": "2026-07-20T10:00:00.000Z"
  }
]
```

### Flow

```
JwtAuthGuard.validate
  → @CurrentUser("id") → userId
  → QueryBus: GetCategoriesQuery(userId)
  → Prisma: category.findMany({ where: { userId }, orderBy: { name: "asc" } })
  → Response
```

---

## GET /api/categories/:id

Get a single category by ID. Returns 404 if the category belongs to another user.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response `200`

```json
{
  "id": "uuid",
  "name": "Groceries",
  "icon": "🛒",
  "color": "#FF6B6B",
  "userId": "uuid",
  "createdAt": "2026-07-20T10:00:00.000Z",
  "updatedAt": "2026-07-20T10:00:00.000Z",
  "transactions": [
    {
      "id": "uuid",
      "amount": "42.50",
      "type": "EXPENSE",
      "description": "Weekly shopping",
      "date": "2026-07-19T00:00:00.000Z"
    }
  ]
}
```

Includes the last 10 transactions for this category.

### Errors

| Status | Condition |
|--------|-----------|
| `404 Not Found` | Category not found or belongs to another user |

### Flow

```
JwtAuthGuard.validate
  → @Param("id") + @CurrentUser("id") → userId
  → QueryBus: GetCategoryByIdQuery(id, userId)
  → Prisma: category.findFirst({ where: { id, userId }, include: { transactions: { take: 10 } } })
  → Response or 404
```

---

## POST /api/categories

Create a new category.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Request Body

```json
{
  "name": "Groceries",
  "icon": "🛒",
  "color": "#FF6B6B"
}
```

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `name` | string | ✅ | Must not be empty |
| `icon` | string | Optional | Emoji or icon name |
| `color` | string | Optional | Must be hex format: `#RRGGBB` |

### Response `201`

```json
{
  "id": "uuid",
  "name": "Groceries",
  "icon": "🛒",
  "color": "#FF6B6B",
  "userId": "uuid",
  "createdAt": "2026-07-20T10:00:00.000Z",
  "updatedAt": "2026-07-20T10:00:00.000Z"
}
```

### Errors

| Status | Condition |
|--------|-----------|
| `400 Bad Request` | Invalid input (empty name, invalid hex color) |
| `404 Not Found` | User not found (stale JWT) |
| `409 Conflict` | Category with the same name already exists |

### Flow

```
CreateCategoryDto
  → ValidationPipe: class-validator (name: required, color: hex format)
  → commandBus: CreateCategoryCommand(userId, name, icon?, color?)
  → CreateCategoryHandler
      → QueryBus: GetUserByIdQuery(userId)         ← verifies user
      → Prisma: category.create(...)
      → EventBus: CategoryCreatedEvent
  → Response
```

---

## PATCH /api/categories/:id

Update an existing category. Only the owner can update their categories.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Request Body

```json
{
  "name": "Supermarket",
  "color": "#51CF66"
}
```

All fields are optional. Only provided fields will be updated.

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | string | Optional, must not be empty |
| `icon` | string | Optional |
| `color` | string | Optional, must be hex format: `#RRGGBB` |

### Response `200`

```json
{
  "id": "uuid",
  "name": "Supermarket",
  "icon": "🛒",
  "color": "#51CF66",
  "userId": "uuid",
  "createdAt": "2026-07-20T10:00:00.000Z",
  "updatedAt": "2026-07-20T10:00:00.000Z"
}
```

### Errors

| Status | Condition |
|--------|-----------|
| `400 Bad Request` | Invalid input |
| `404 Not Found` | Category not found or belongs to another user |

### Flow

```
UpdateCategoryDto
  → ValidationPipe
  → commandBus: UpdateCategoryCommand(id, userId, name?, icon?, color?)
  → UpdateCategoryHandler
      → Prisma: category.updateMany({ where: { id, userId }, data })
      → Prisma: category.findFirst({ where: { id, userId } })
      → EventBus: CategoryUpdatedEvent
  → Response
```

---

## DELETE /api/categories/:id

Delete a category. Only the owner can delete their categories.

### Headers

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response `204` (No Content)

No response body.

### Errors

| Status | Condition |
|--------|-----------|
| `404 Not Found` | Category not found or belongs to another user |

### Flow

```
@Param("id") + @CurrentUser("id") → userId
  → commandBus: DeleteCategoryCommand(id, userId)
  → DeleteCategoryHandler
      → Prisma: category.deleteMany({ where: { id, userId } })
      → EventBus: CategoryDeletedEvent
  → Response (204)
```
