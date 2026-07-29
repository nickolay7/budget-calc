1. Чеклист для ревьюера (всегда проверять)

## Чеклист
- [ ] PR title соответствует Conventional Commits
- [ ] Проект собирается без ошибок
- [ ] FSD-слои не нарушены (нет горизонтальных импортов)
- [ ] CQRS-паттерны соблюдены
- [ ] Нет утечек данных пользователя
- [ ] Все входные данные валидируются через DTO
- [ ] Денежные поля в Prisma — `Decimal`, не `Float`
- [ ] Новые страницы с `useSearchParams` обёрнуты в `<Suspense>`
- [ ] Компоненты покрывают все состояния: loading / empty / error / data
- [ ] На фронтенде используется `apiClient()` / `publicClient()`, не голый `fetch`
- [ ] Контроллеры JWT-защищены по умолчанию; `@Public()` только там, где нужно осознанно
- [ ] Миграции сделаны через `npm run db:migrate`, schema.prisma не менялась вручную

2. Стиль и именования

## Стиль
- Файлы: kebab-case (`categories.controller.ts`, `auth.service.ts`)
- Контроллеры: `EntityController`
- Команды CQRS: `CreateEntityCommand`, `UpdateEntityCommand`
- Запросы CQRS: `GetEntityQuery`, `GetAllEntitiesQuery`
- DTO: `CreateEntityDto`, `UpdateEntityDto`
- Zod схемы в shared: `createEntitySchema`, `updateEntitySchema`
- Shared types: интерфейсы `EntityProfile`, `CreateEntityDto`
- FSD: папки в kebab-case, React-компоненты в PascalCase

3. Что пропускать

## Пропускать при ревью
- Файлы миграций Prisma (`prisma/migrations/**`)
- `package-lock.json` и другие lock-файлы
- `*.log` файлы
- `docker/` — Docker Compose и скрипты БД
- `tooling/` — конфиги сборки и ESLint