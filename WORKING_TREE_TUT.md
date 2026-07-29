# Git Worktree: туториал

Git worktree позволяет иметь **несколько рабочих директорий** одного репозитория одновременно. Каждая копия живёт в своей папке, может быть на своей ветке и иметь своё состояние файлов — при этом все копии разделяют общую `.git`-историю (не нужно клонировать заново).

---

## Зачем нужен worktree

Обычно у вас одна рабочая директория, привязанная к `HEAD`. Чтобы переключиться на другую ветку, нужно закоммитить или припрятать (`stash`) текущие изменения. Worktree позволяет:

- Работать над фичей и параллельно править баг в другой ветке — без `stash` и переключений
- Запускать несколько агентов (Claude Code), каждый в своей изолированной копии
- Иметь production-сборку в одной ветке, а разработку — в другой
- Сравнивать поведение двух веток side-by-side

---

## Базовые команды

```bash
# Создать новый worktree на ветке my-feature в папке ../my-feature
git worktree add ../my-feature my-feature

# Создать worktree с новой веткой
git worktree add -b new-branch ../new-feature main

# Список всех worktree
git worktree list

# Удалить worktree (предварительно закоммитив изменения)
git worktree remove ../my-feature
```

---

## Как я использовал worktree в этой задаче

Мне нужно было добавить JSDoc в ~120 файлов, разбитых на 4 независимые группы:

| Группа | Файлов | Директория |
|---|---|---|
| Backend (NestJS) | 64 | `apps/api/src/` |
| Frontend pages | 21 | `apps/web/src/app/` |
| Features / Entities / Components | 19 | `apps/web/src/features/`, `entities/`, `components/`, ... |
| Shared package | 18 | `packages/shared/src/` |

Каждая группа обрабатывалась отдельным агентом Claude Code. Без worktree они бы конфликтовали: один читает файл, другой его меняет, третий пишет. С worktree каждый получил **физически отдельную копию** файлов.

### 1. Запуск агентов с worktree-изоляцией

При запуске агента указывается `isolation: "worktree"`:

```js
Agent({
  description: "Add JSDoc to backend API",
  isolation: "worktree",  // <-- ключевой параметр
  // ...
})
```

Под капотом Claude Code выполняет:

```bash
# Создаётся ответвление от текущего состояния main
git branch worktree-agent-xxx 3b69730

# Создаётся worktree на этой ветке
git worktree add .claude/worktrees/agent-xxx worktree-agent-xxx
```

После этого агент работает в `/.claude/worktrees/agent-xxx/` как в обычном репозитории — читает и редактирует файлы, но его изменения не видны основной рабочей директории.

### 2. Параллельная работа

4 агента запускаются в одном сообщении (одновременно):

```
main (изначально)
├── git worktree → agent-aef879a... → backend (64 файла)
├── git worktree → agent-acf50336... → frontend pages (21 файл)
├── git worktree → agent-afbb542d... → features (19 файлов)
└── git worktree → agent-afe2d106... → shared (18 файлов)
```

Каждый агент заканчивает за 4–7 минут. Без worktree пришлось бы запускать последовательно — в 4 раза дольше.

### 3. Перенос изменений в основную директорию

Агенты не закоммитили изменения (они остались как `modified` в ворктри). Чтобы перенести их в основную директорию:

```bash
# Сгенерировать патч из worktree
git -C .claude/worktrees/agent-xxx diff > /tmp/jsdoc-backend.patch

# Применить патч в основной директории
git apply /tmp/jsdoc-backend.patch
```

И так для каждого worktree:

```bash
# Например, для трёх групп:
git -C .claude/worktrees/agent-acf50336... diff > /tmp/jsdoc-pages.patch && git apply /tmp/jsdoc-pages.patch
git -C .claude/worktrees/agent-afbb542d... diff > /tmp/jsdoc-features.patch && git apply /tmp/jsdoc-features.patch
git -C .claude/worktrees/agent-afe2d106... diff > /tmp/jsdoc-shared.patch && git apply /tmp/jsdoc-shared.patch
```

### 4. Коммит

Когда все патчи применены, коммитим как обычно:

```bash
git add -A
git commit -m "docs: add JSDoc comments to all backend, frontend and shared modules"
```

### 5. Очистка

Удаляем worktree (с флагом `--force`, т.к. там незакоммиченные патчи):

```bash
git worktree remove --force .claude/worktrees/agent-xxx
```

Удаляем созданные ветки:

```bash
git branch -D worktree-agent-xxx
```

---

## Полный cycle-скрипт

```bash
# === СОЗДАНИЕ ===
git branch worktree-agent-task1 main
git worktree add .claude/worktrees/agent-task1 worktree-agent-task1

# ... работа в worktree ...

# === ЗАБОР ИЗМЕНЕНИЙ ===
git -C .claude/worktrees/agent-task1 diff > /tmp/patch-task1.patch
git apply /tmp/patch-task1.patch

# === КОММИТ ===
git add -A
git commit -m "..."

# === ОЧИСТКА ===
git worktree remove --force .claude/worktrees/agent-task1
git branch -D worktree-agent-task1
```

---

## Когда использовать worktree

✅ **Нужно** когда:
- Параллельная работа нескольких агентов над разными файлами
- Долгая операция (миграция, рефакторинг), не хочется блокировать основную ветку
- Нужно запустить тесты или сборку на другой ветке, не прерывая текущую работу

❌ **Не нужно** когда:
- Простая последовательная правка (один агент, одна группа файлов)
- Изменения затрагивают одни и те же файлы (worktree не поможет — нужна координация)

---

## Важные замечания

- **Общая история**: коммит из worktree виден во всех worktree и основной директории — история одна.
- **Незакоммиченные изменения**: они живут только в своём worktree. Чтобы перенести — `git diff` → `git apply`.
- **Дедрейм**: worktree не имеет защиты от одновременной записи в одни и те же файлы (это ваша ответственность).
- **Cleanup**: всегда удаляйте worktree после использования — забытые worktree занимают место.
