# План: Внедрение модуля категорий с CQRS

## Контекст

Модуль категорий (`apps/api/src/modules/categories/`) содержит заглушки TODO для `create()` и `update()`, а также не проверяет владельца при операциях `findOne()`, `update()` и `remove()`. Требуется:
- Полная реализация CRUD
- Переход на CQRS (как в Users-модуле)
- Взаимодействие с User-модулем через CQRS (как Auth→Users)
- Исправление проверок владения
- Понятные сообщения валидации

---

## Чек-лист задач

### Шаг 1: Queries (2 файла)
- [x] `queries/get-categories.query.ts` — `GetCategoriesQuery(userId: string)`
- [x] `queries/get-category-by-id.query.ts` — `GetCategoryByIdQuery(id, userId)`

### Шаг 2: Commands (3 файла)
- [x] `commands/create-category.command.ts` — `CreateCategoryCommand(userId, name, icon?, color?)`
- [x] `commands/update-category.command.ts` — `UpdateCategoryCommand(id, userId, name?, icon?, color?)`
- [x] `commands/delete-category.command.ts` — `DeleteCategoryCommand(id, userId)`

### Шаг 3: Events (3 файла)
- [x] `events/category-created.event.ts`
- [x] `events/category-updated.event.ts`
- [x] `events/category-deleted.event.ts`

### Шаг 4: Handlers (5 файлов)
- [x] `handlers/get-categories.handler.ts` — `findMany({ where: { userId } })`
- [x] `handlers/get-category-by-id.handler.ts` — `findFirst({ where: { id, userId }, include: { transactions: { take: 10, orderBy: { date: "desc" } } } })`
- [x] `handlers/create-category.handler.ts` — проверка пользователя через `GetUserByIdQuery` → `prisma.category.create` → событие
- [x] `handlers/update-category.handler.ts` — `updateMany` + re-fetch + событие
- [x] `handlers/delete-category.handler.ts` — `deleteMany` + событие

### Шаг 5: Модификация контроллера
- [x] Заменить `CategoriesService` на `QueryBus` + `CommandBus`
- [x] Типизировать `@Body()` как `CreateCategoryDto` / `UpdateCategoryDto`
- [x] Добавить `@CurrentUser("id") userId` в `findOne`, `update`, `remove`

### Шаг 6: Модификация модуля
- [x] Удалить `CategoriesService` из imports/providers
- [x] Импортировать `CqrsModule`
- [x] Зарегистрировать 5 handler'ов в providers

### Шаг 7: Удаление
- [x] Удалить `categories.service.ts`

### Шаг 8: Валидация DTO
- [x] `@IsNotEmpty()` на `name` — пустое имя не проходит
- [x] `@Matches(/^#[0-9a-fA-F]{6}$/)` на `color` — невалидный hex отклоняется
- [x] Понятные сообщения через аргумент `{ message: "..." }`

### Шаг 9: Проверка
- [x] `npm run build -w @budget-calc/api` — успешно
- [x] `npm run lint` — успешно

---

## Ключевые решения

| Решение | Выбор | Причина |
|---------|-------|---------|
| Паттерн контроллера | `QueryBus`/`CommandBus` напрямую (как Users) | Users — канонический CQRS-модуль |
| Сервис | Удалить | Логика в handler'ах |
| Проверка пользователя | Да — `GetUserByIdQuery` на create | CQRS-взаимодействие (как Auth→Users) |
| Проверка владения | `findFirst`/`updateMany`/`deleteMany` с `userId` | Безопасность: чужие категории недоступны |
| События | Публикация 3 событий | Паттерн `UserCreatedEvent`; обработчики не нужны сейчас |
| Валидация `name` | `@IsString()` + `@IsNotEmpty()` | Предотвращает пустые имена |
| Валидация `color` | `@IsString()` + `@Matches(/^#[0-9a-fA-F]{6}$/)` | Принимает только hex-формат |

## Валидация DTO

### `create-category.dto.ts`
```typescript
@IsString({ message: "name must be a string" })
@IsNotEmpty({ message: "name should not be empty" })
name!: string;

@IsOptional()
@IsString({ message: "icon must be a string" })
icon?: string;

@IsOptional()
@IsString({ message: "color must be a string" })
@Matches(/^#[0-9a-fA-F]{6}$/, {
  message: "color must be a valid hex color (e.g. #FF0000)",
})
color?: string;
```

### `update-category.dto.ts`
Те же правила, все поля `@IsOptional()`.

### Пример ответа при ошибке
```json
{
  "message": ["name should not be empty", "color must be a valid hex color (e.g. #FF0000)"],
  "error": "Bad Request",
  "statusCode": 400
}
```

## CQRS-взаимодействие между модулями

```
POST /api/categories
  → CategoriesController.create(userId, dto)
  → commandBus.execute(CreateCategoryCommand)
  → CreateCategoryHandler.execute()
      → queryBus.execute(GetUserByIdQuery(userId))    // проверка пользователя (кросс-модуль)
      → prisma.category.create(...)
      → eventBus.publish(CategoryCreatedEvent)
      → return category
```

## Проверка владения

| Операция | Было | Стало |
|----------|------|-------|
| `findAll` | ✅ По `userId` | ✅ Без изменений |
| `findOne` | ❌ Любой ID | ✅ `findFirst({ where: { id, userId } })` |
| `create` | ❌ Заглушка | ✅ `GetUserByIdQuery` + Prisma |
| `update` | ❌ Заглушка | ✅ `updateMany({ where: { id, userId } })` |
| `remove` | ❌ `delete({ where: { id } })` | ✅ `deleteMany({ where: { id, userId } })` |

## Структура файлов

```
apps/api/src/modules/categories/
  categories.module.ts
  categories.controller.ts
  dto/
    create-category.dto.ts
    update-category.dto.ts
  commands/
    create-category.command.ts
    update-category.command.ts
    delete-category.command.ts
  queries/
    get-categories.query.ts
    get-category-by-id.query.ts
  handlers/
    get-categories.handler.ts
    get-category-by-id.handler.ts
    create-category.handler.ts
    update-category.handler.ts
    delete-category.handler.ts
  events/
    category-created.event.ts
    category-updated.event.ts
    category-deleted.event.ts
```

## Верификация

1. **Сборка**: `npm run build -w @budget-calc/api`
2. **Линтер**: `npm run lint`
3. **Ручное тестирование** (после `npm run compose:up` + `npm run dev -w @budget-calc/api`):
   - `POST /api/categories` — создание категории
   - `POST /api/categories` с пустым `name` → 400 + понятное сообщение
   - `POST /api/categories` с `color: "red"` → 400 + понятное сообщение
   - `GET /api/categories` — только свои категории
   - `GET /api/categories/:id` — 404 для чужой категории
   - `PATCH /api/categories/:id` — обновление
   - `DELETE /api/categories/:id` — удаление
   - Дубликат `(name, userId)` → 409 Conflict
