# Как работает сервер документации

## Запуск

```bash
npm run serve-docs
```

npm 9 находит скрипт `serve-docs` в workspace `@budget-calc/docs` и выполняет:

```
node --watch serve.mjs
```

Флаг `--watch` перезапускает сервер при изменениях в `serve.mjs`.

---

## Сервер (`apps/docs/serve.mjs`)

Express-сервер на порту **4000**. Два маршрута:

| Маршрут | Что делает |
|---|---|
| `GET /` | Редирект на `/docs/index` |
| `GET /docs/:path` | Ищет `.md` файл в `apps/docs/src/`, рендерит в HTML |

---

## Обработка запроса

Когда пользователь открывает `http://localhost:4000/docs/02-api/auth`:

1. Express получает `GET /docs/02-api/auth`
2. Из пути вырезается `/docs/` → остаётся `02-api/auth`
3. К пути добавляется `.md` → `apps/docs/src/02-api/auth.md`
4. Файл читается с диска (`fs.readFileSync`)
5. Markdown конвертируется в HTML через `marked.parse()`
6. Из HTML достаётся первый `<h1>` как заголовок страницы
7. Всё заворачивается в HTML-шаблон с боковой навигацией
8. `highlight.js` подсвечивает код на странице
9. Готовый HTML отправляется браузеру

---

## Структура ответа

```html
<!DOCTYPE html>
<html>
<head>
  <title>Auth API — Budget Calc Docs</title>
  <!-- highlight.js theme загружается динамически через JS -->
</head>
<body>
  <aside class="sidebar">
    <!-- Навигация из 7 секций, активный пункт подсвечен -->
    <!-- Внизу сайдбара: кнопка переключения темы 🌓 Theme -->
  </aside>
  <main class="content">
    <!-- Сконвертированный markdown -->
  </main>
  <script src="/hljs/highlight.min.js" defer></script>
  <script>
    // Определяет тему (localStorage или prefers-color-scheme),
    // загружает github.css / github-dark.css для highlight.js,
    // по клику на кнопку переключает тему и сохраняет выбор.
  </script>
</body>
</html>
```

---

## Навигация

Зашита прямо в `serve.mjs` как массив `NAV`:

```javascript
const NAV = [
  { title: "Home",                  href: "index" },
  { title: "Architecture",          children: [ /* ... */ ] },
  { title: "API Reference",         children: [ /* ... */ ] },
  { title: "Modules",               children: [ /* ... */ ] },
  { title: "Guides",                children: [ /* ... */ ] },
  { title: "Reference",             children: [ /* ... */ ] },
  { title: "How It Works",          children: [ /* ... */ ] },
];
```

Функция `renderNav(activeHref)` проходит по массиву и генерирует `<ul>` с `<a>` тегами. Активный пункт подсвечивается синим.

---

## Подсветка кода

Файлы highlight.js раздаются статически через Express:

```javascript
app.use('/hljs', express.static(
  path.resolve(__dirname, '../..', 'node_modules/highlight.js')
));
```

В браузере `hljs.highlightAll()` автоматически подсвечивает все блоки `<pre><code>`.

---

## Тёмная тема

Сервер поддерживает тёмную тему двумя способами:

1. **Автоматически** — через `prefers-color-scheme` в CSS. Если в ОС включена тёмная тема, страница рендерится в тёмных цветах (`#0f172a` фон, `#e2e8f0` текст).
2. **Вручную** — кнопка `🌓 Theme` внизу сайдбара. Выбор сохраняется в `localStorage` и не сбрасывается при перезагрузке.

Как это работает:
- Все цвета заданы через CSS custom properties (`--bg`, `--text`, `--link`, и т.д.)
- По умолчанию — светлая палитра
- `@media (prefers-color-scheme: dark)` применяет тёмную, если нет явного выбора
- `:root[data-theme="dark"]` принудительно включает тёмную (когда пользователь нажал кнопку)
- CSS-селектор `:root:not([data-theme])` в media-query гарантирует, что явный выбор не переопределяется системными настройками

Подсветка кода в тёмной теме: `highlight.js` переключается между `github.min.css` (светлая) и `github-dark.min.css` (тёмная) динамически через JavaScript, без перезагрузки страницы.

---

## Безопасность

Есть защита от path traversal — если запрошенный файл не начинается с `SRC`, возвращается `403 Forbidden`:

```javascript
if (!mdFile.startsWith(SRC)) {
  res.status(403).send(renderPage("Forbidden", ...));
  return;
}
```

---

## Почему `serve-docs`, а не `docs:dev`

npm 9 с workspaces интерпретирует `docs:dev` как `npm run dev -w @budget-calc/docs` (синтаксис `workspace:script`). Поэтому имя скрипта — `serve-docs`: оно не пересекается с названием workspace.

---

## Визуальная схема

```
┌─ Терминал ─────────────────────────────────┐
│ npm run serve-docs                          │
│   → @budget-calc/docs: serve-docs           │
│     → node --watch serve.mjs                │
│       → Express listening on :4000          │
└─────────────────────────────────────────────┘
                      │
   ┌──────────────────┼──────────────────┐
   ▼                  ▼                  ▼
GET /docs/index    GET /docs/02-api/auth    GET /docs/nonexistent
   │                  │                    │
   ▼                  ▼                    ▼
apps/docs/src/     apps/docs/src/          404
index.md → HTML    02-api/auth.md → HTML   Not Found
```

**Стек:** Express → marked (markdown→HTML) → highlight.js (подсветка кода) → Express отдаёт готовую HTML-страницу.
