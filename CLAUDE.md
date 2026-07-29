# CLAUDE.md — Budget Calc

Monorepo expense tracker: Next.js 16 (frontend) + NestJS 11 (backend) + Prisma 6 (PostgreSQL).

**Workspace-specific instructions** → `apps/web/CLAUDE.md` и `apps/api/CLAUDE.md`. Перед работой с воркспейсом начни с них.

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

## Commit conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

| Type | When to use |
|---|---|
| `feat:` | New feature for the user or backend endpoint |
| `fix:` | Bug fix |
| `chore:` | Tooling, configs, dependencies, CI, project setup |
| `docs:` | Documentation-only changes |
| `refactor:` | Code change that neither fixes a bug nor adds a feature |
| `style:` | Formatting, lint fixes (no logic change) |
| `test:` | Adding or correcting tests |
| `perf:` | Performance improvement |

**Format**: `<type>[(scope)]: <short summary>`
- Scope is optional — `api`, `web`, `shared`, `docs`, `docker`.
- Summary starts lowercase, no period, imperative mood.
- Separate body from subject with a blank line. Use body to explain *why*.
- Footer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` when Claude Code contributed.

## Voice Mode (voice-cc)

- Wrap your end-of-turn summary in `<say>...</say>` tags.
- Make the summary stand alone — no references to "this response".
- Aim for one sentence. Omit if no useful audio summary.
