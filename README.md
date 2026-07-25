# Budget Calc

Personal expense tracker.

## Stack

- **Frontend**: Next.js 16 (App Router), Tailwind CSS 4
- **Backend**: NestJS 11, Prisma 6, CQRS
- **Database**: PostgreSQL 17 (Docker)
- **Monorepo**: npm workspaces

## Quick start

```bash
# Start PostgreSQL
npm run compose:up

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Run both apps in dev mode
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Documentation

The project includes a local documentation server covering architecture, API reference, and development guides.

```bash
# Start the documentation viewer
npm run serve-docs
```

- Docs: http://localhost:4000

### Contents

| Section | Description |
|---|---|
| Architecture | CQRS pattern, module communication, high-level design |
| API Reference | Auth (register, login, refresh) and Users endpoints |
| Modules | Auth and Users module internals |
| Guides | Adding new CQRS flows, extending auth |
| Reference | File tree of all changes, shared types |
| How It Works | Как устроен сервер документации (на русском) |
