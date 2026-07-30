---
name: create-pr
description: Create a GitHub Pull Request following the project's conventions
argumentsHint: "title, base_branch (default: main)"
allowedTools:
  - Bash(git *)
  - Bash(gh *)
model: claude-sonnet-4-5
---
# Create PR skill

Creates a GitHub Pull Request using the project's PR template and Conventional Commits conventions.

## Args

| Position | Required | Default | Description |
|----------|---|---|---|
| `$0`     | Yes | — | PR title in Conventional Commits format, e.g. `feat(api): add login endpoint` or `fix(web): correct validation` |
| `S1`     | No | `main` | Target branch to merge into |

## Usage

1. Проверить, что текущая ветка не main или develop
2. Убедиться, что ветка запушена в remote
3. Получить список коммитов: git log main..$0 --oneline
4. Получить полный diff: git diff main
5. На основе коммитов составить описание PR
6. Создать PR: gh pr create --title "$0" --base "$1" --body "..."
7. Вывести URL созданного PR

Если PR для этой ветки уже существует — сообщить и вывести ссылку.

Вызов скилла с аргументами

/pr "feat: добавить модуль платежей" main

Или без аргументов — Claude увидит argumentsHint и задаст уточняющие вопросы интерактивно.

```
/create-pr <title> [target-branch]
/create-pr feat(api): add login endpoint
/create-pr fix(web): correct form validation main
/create-pr chore(deps): update prisma dev
```

Multiple scopes: comma-separated, e.g. `feat(api,web): add login page`.

## Workflow

1. **Check branch** — must not be `main` or target branch
2. **Rebase** — `git rebase <target>` to ensure clean history
3. **Push** — `git push -u origin HEAD`
4. **Read diff** — `git diff <target>...HEAD --stat` to understand changes
5. **Build description** — fill the template below based on the diff
6. **Confirm** — show the full PR body and ask for confirmation
7. **Create** — `gh pr create --title "<title>" --body "<body>" --base <target>`

## PR template to fill

```
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

## Rules

- Every branch needs a PR — even solo work
- PR title follows the same format as commit messages
- Squash and merge is the merge method
- Never merge without PR review (except trivial fixes)
- Delete branch after merge
