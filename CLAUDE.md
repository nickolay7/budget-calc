# CLAUDE.md — Budget Calc

Monorepo expense tracker: Next.js 16 (frontend) + NestJS 11 (backend) + Prisma 6 (PostgreSQL).

**Workspace-specific instructions** → `apps/web/CLAUDE.md` and `apps/api/CLAUDE.md`. Start with those before working in a workspace.

---

## Commands

```bash
# Development (parallel frontend + backend)
npm run dev

# Database
npm run compose:up
npm run compose:down
npm run db:migrate    # Prisma migrate dev
npm run db:generate   # Prisma generate
npm run db:studio     # Prisma Studio
npm run db:seed       # Run seed

# Per-workspace
npm run dev -w @budget-calc/web
npm run dev -w @budget-calc/api

# Other
npm run build
npm run lint
npm run format
```

## Architecture

```
apps/web       — Next.js 16 (App Router) — port 3000
apps/api       — NestJS 11 + Prisma 6 — port 3001, API prefix: /api
packages/shared — Shared types, Zod schemas, constants, utils
```

## Adding a new entity workflow

1. Prisma model → `npm run db:migrate`
2. NestJS module (`apps/api/src/modules/<entity>/`)
3. Types + Zod schema in `packages/shared/src/`
4. Next.js route + page + form in `apps/web/src/`

---

## Branch workflow (GitHub Flow)

| Rule | Description |
|---|---|
| `main` is always deployable | Never commit broken or unfinished work directly to `main` |
| Branch off `main` | Every feature, fix, or change gets its own branch from `main` |
| Branch naming | Use conventional-commit prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `style/`, `test/`, `perf/` |
| Open a PR | Every branch → pull request into `main`. Use `gh pr create` or the GitHub web UI. |
| Merge via PR | **Squash and merge** for feature branches |
| Delete after merge | Delete the feature branch immediately after merging |
| Keep it short-lived | Feature branches should live hours or days, not weeks |
| Rebase before PR | `git rebase main` before opening the PR to avoid conflicts |

### PR description template

```markdown
<type>(<scope>): <short summary>

## Summary

<!-- One paragraph: what this PR does and why. -->

## Key changes

### Backend (<scope>)
<!-- New endpoints, service changes, migrations. List each new endpoint with method + path. -->

### Shared (<scope>)
<!-- New types, schemas, constants. -->

### Frontend (<scope>)
<!-- New pages, components, hooks, stores. Describe each render state (loading / empty / error / data). -->

## States covered

| Component | Loading | Empty | Error | Data |
|---|---|---|---|---|
| ... | skeleton | ... | retry | ... |

## Testing

- [ ] Manual testing notes or steps
- [ ] Edge cases handled (empty data, errors, ...)
```

## Branch workflow (GitHub Flow)

We follow [GitHub Flow](https://guides.github.com/introduction/flow/):

| Rule | Description |
|---|---|
| `main` is always deployable | Never commit broken or unfinished work directly to `main` |
| Branch off `main` | Every feature, fix, or change gets its own branch from `main` |
| Branch naming | Use conventional-commit prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `style/`, `test/`, `perf/` — e.g. `feat/main-screen`, `fix/login-error` |
| Open a PR | Every branch → pull request into `main`, even for solo work. Use `gh pr create` or the GitHub web UI. |
| PR description | Use the template below — group changes by workspace, list new endpoints, cover all states. See **PR description template** section. |
| Merge via PR | Use **Squash and merge** for feature branches — keeps `main` history clean |
| Delete after merge | Delete the feature branch immediately after merging |
| Keep it short-lived | Feature branches should live hours or days, not weeks. Large features → break into smaller incremental PRs |
| Rebase before PR | `git rebase main` before opening the PR to avoid conflicts |

### PR description template

```markdown
<type>(<scope>): <short summary>

## Summary

<!-- One paragraph: what this PR does and why. -->

## Key changes

### Backend (<scope>)
<!-- New endpoints, service changes, migrations. List each new endpoint with method + path. -->

### Shared (<scope>)
<!-- New types, schemas, constants. -->

### Frontend (<scope>)
<!-- New pages, components, hooks, stores. Describe each render state (loading / empty / error / data). -->

## States covered

| Component | Loading | Empty | Error | Data |
|---|---|---|---|---|
| ... | skeleton | ... | retry | ... |

## Testing

- [ ] Manual testing notes or steps
- [ ] Edge cases handled (empty data, errors, ...)
```

The `<type>(<scope>):` line is the conventional-commit PR title (use comma-separated scopes if multiple: `feat(api,web):`). Add a blank line before the body.

## Voice Mode (voice-cc)

- Wrap your end-of-turn summary in `<say>...</say>` tags.
- Make the summary stand alone — no references to "this response".
- Aim for one sentence. Omit if no useful audio summary.

## Documentation

- Update JSDoc after changing methods.
- Add or update Swagger decorators for DTOs and controllers.
- When adding new functionality, check `@apps/docs/*` for related files.
- Keep docs updated when changing architecture or API.
