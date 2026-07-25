# Budget Calc — Documentation

> Architecture, API reference, and development guides for the Budget Calc monorepo.

## Sections

### [Architecture](src/01-architecture/overview.md)
- High-level system architecture
- [CQRS Pattern](src/01-architecture/cqrs-pattern.md) — Command Query Responsibility Segregation
- [Module Communication](src/01-architecture/module-communication.md) — how modules talk via CQRS buses

### [API Reference](src/02-api/auth.md)
- [Auth API](src/02-api/auth.md) — register, login, refresh
- [Users API](src/02-api/users.md) — profile management

### [Modules](src/03-modules/auth.md)
- [Auth Module](src/03-modules/auth.md) — JWT authentication internals
- [Users Module](src/03-modules/users.md) — user management via CQRS

### [Guides](src/04-guides/adding-new-cqrs-flow.md)
- [Adding a New CQRS Flow](src/04-guides/adding-new-cqrs-flow.md) — step-by-step
- [Extending Auth](src/04-guides/extending-auth.md) — adding providers, roles, etc.

### [Reference](src/05-reference/file-tree.md)
- [Changed File Tree](src/05-reference/file-tree.md) — all files touched by the auth implementation
- [Shared Types](src/05-reference/types.md) — TypeScript types and Zod schemas

### [How It Works](src/06-how-it-works/docs-server.md)
- [Docs Server](src/06-how-it-works/docs-server.md) — как работает сервер документации (объяснение на русском)
