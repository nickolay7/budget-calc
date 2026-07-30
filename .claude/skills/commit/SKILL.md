---
name: commit
description: Make a commit following the project's Conventional Commits conventions
allowedTools:
  - Bash(git *)
model: claude-sonnet-4-5
effort: low
---

# Commit skill

This skill helps you make commits that follow the project's commit conventions. It reads the current diff, suggests a proper commit message, and commits on approval.

## When to use

- The user says "commit" or "commit this" or "make a commit"
- The user wants to stage and commit changes

## Convention reference

The project follows **Conventional Commits**: `<type>[(scope)]: <short summary>`

### Commit types

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

### Format rules

- **Summary** starts lowercase, no period, imperative mood
- **Scope** is optional — one of: `api`, `web`, `shared`, `docs`, `docker`
- Scope+type format: `<type>(<scope>): <summary>` — e.g. `feat(api): add login endpoint`
- Separate body from subject with a blank line
- Use body to explain **why**, not what (the diff shows what)
- Footer `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>` when Claude Code contributed (not needed when user commits themselves)

## Workflow

1. **Stage changes**: if nothing is staged, run `git add -A` (ask first if unsure)
2. **Read diff**: `git diff --cached --stat` and `git diff --cached` to understand the changes
3. **Suggest message**: propose a commit message matching the conventions above — type, scope, summary, optionally body
4. **Confirm**: present the message and ask for confirmation before committing
5. **Commit**: `git commit -m "<subject>" -m "<body>"` (separate `-m` for each paragraph)

## Правила коммитов

Типы: feat, fix, docs, refactor, test, ci
Scope: backend, frontend, shared, config
Описание: кратко на русском, в настоящем времени

## Примеры

feat(backend): добавить модуль транзакций
fix(frontend): исправить валидацию формы регистрации

## Контекст выполнения
Статус проекта: !git status
Последние коммиты: !git log --oneline -10

## Алгоритм выполнения

1. git diff — проверить контент для сообщения
2. Определить type и scope
3. git add — добавить только нужные файлы (не git add .)
4. Сформировать сообщение по правилам
5. git commit через heredoc
6. Проверить результат

## Запрещено

- Никогда не пушить автоматически
- Не использовать --no-verify или --amend без явной просьбы
- Не добавлять файлы без понимания их содержимого