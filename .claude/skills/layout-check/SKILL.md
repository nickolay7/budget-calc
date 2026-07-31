---
name: layout-check
description: Check frontend page layout on desktop (1440x900) and mobile (390x844) via Playwright MCP. Optional argument: URL path to check, empty = all pages.
argumentsHint: "url"
allowedTools:
  - mcp__playwright__*
  - Bash(curl *)
effort: medium
---

# Layout check skill

Проверяет вёрстку страниц фронтенда на десктопе и мобильном через Playwright MCP. Запускается после изменений в UI (компоненты, стили, layout) для выявления поломок вёрстки.

## Когда использовать

- Пользователь просит проверить вёрстку/верстку после изменений
- Команда `/layout-check` (все страницы) или `/layout-check /login` (конкретная страница)
- После изменения компонентов, стилей, layout-ов фронтенда

## Аргументы

| Позиция | Обязателен | Описание |
|---|---|---|
| `$0` | Нет | URL-путь страницы, например `/login`, `/transactions`. Пусто → проверить все страницы. |

Примеры:

```
/layout-check            # все страницы
/layout-check /login     # только /login
/layout-check /transactions
```

## Контекст

- Dev-сервер: `http://localhost:3000` (`npm run dev`)
- Вьюпорты (совпадают со скриншотами в корне репо `*-desktop-1440.png` / `*-mobile-390.png`):
  - Desktop: **1440×900**
  - Mobile: **390×844**
- Авторизация: middleware защищает dashboard-страницы — без логина они редиректят на `/login?redirect=...`

## Страницы приложения

| Группа | Роуты | Доступ |
|---|---|---|
| `(auth)` | `/login`, `/register`, `/forgot-password`, `/reset-password` | публичные |
| `(dashboard)` | `/`, `/transactions`, `/transactions/new`, `/categories`, `/budgets`, `/accounts`, `/settings` | требуют авторизации |
| динамические | `/transactions/[id]`, `/categories/[id]` | требуют ID |

## Воркфлоу

1. **Проверить, что сервер запущен**: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000`. Если не отвечает → сказать пользователю запустить `npm run dev` и остановиться.
2. **Составить список URL**:
   - Аргумент задан → `["<аргумент>"]`
   - Пусто → все статические роуты из таблицы выше. Динамические `[id]`-роуты не включать (нужен реальный ID).
3. **Для каждой страницы** — два прохода (desktop, затем mobile):

   a. **Desktop**: `browser_resize` (1440×900) → `browser_navigate` к URL → дождаться рендера → `browser_take_screenshot` (fullPage) → `browser_evaluate` метрики вёрстки (см. ниже) → `browser_console_messages` (level: error).

   b. **Mobile**: `browser_resize` (390×844) → `browser_navigate` к URL → дождаться рендера → `browser_take_screenshot` (fullPage) → `browser_evaluate` метрики → `browser_console_messages` (level: error).

   ⚠️ Ресайз делать **до** навигации, чтобы страница отрендерилась с нужной шириной вьюпорта. Подождать завершения рендера перед скриншотом.

4. **Анализ**: для каждого прохода оценить скриншот визуально + метрики.

## Метрики вёрстки (browser_evaluate)

Вставить в `browser_evaluate` и оценить результат:

```js
() => {
  const doc = document.documentElement;
  const vw = window.innerWidth;
  const overflowX = doc.scrollWidth - doc.clientWidth;
  const offenders = [...document.querySelectorAll('body *')]
    .map((el) => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      return { el, r, cs };
    })
    .filter(({ el, r }) =>
      r.width > 0 && r.height > 0 &&
      (r.right > vw + 1 || r.left < -1) &&
      !['html', 'body'].includes(el.tagName.toLowerCase()))
    .slice(0, 12)
    .map(({ el, r, cs }) => ({
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: typeof el.className === 'string' ? el.className.slice(0, 100) : null,
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      position: cs.position,
      overflowX: cs.overflowX,
    }));
  return { viewport: vw, clientWidth: doc.clientWidth, scrollWidth: doc.scrollWidth, overflowX, offenders };
}
```

Что искать в результате:
- `overflowX > 0` — есть горизонтальный скролл → баг
- `offenders` непустой — элементы выходят за вьюпорт (в т.ч. `position: fixed` с неверной шириной) → баг
- `scrollWidth` заметно больше `clientWidth` — контент шире экрана

## Критерии ошибок вёрстки (визуально по скриншотам)

**Оба вьюпорта:**
- Горизонтальный скролл, контент обрезан по правому краю
- Элементы выступают за границы вьюпорта (в т.ч. fixed-шапка/модалки)
- Перекрытие элементов друг другом, наложение текста
- Текст обрезан, переносится нечитаемо, выпадает из контейнеров
- Пустые/«сжатые» зоны: контент слишком узкий при большой ширине экрана

**Mobile (390×844) дополнительно:**
- Нет адаптива: десктопная сетка не складывается в колонки, таблицы/формы выходят за экран
- Шапка/сайдбар не переключается в мобильный вариант (гамбургер и т.п.)
- Стики-элементы перекрывают контент
- Тач-элементы (кнопки, поля) слишком маленькие для тапа

**Консоль (оба вьюпорта):** ошибки — hydration mismatch, ошибки запросов, React warning-и уровня error.

## Особые случаи

- **Dashboard-страницы без авторизации**: middleware редиректит на `/login`. Если так произошло — зафиксировать в отчёте: «страница проверена как редирект на /login, реальный layout dashboard не проверен». Для полной проверки dashboard — залогиниться через браузер (форма на `/login`) и повторить.
- **Редирект на другую страницу** — проверить целевую страницу, отметить редирект в отчёте.

## Отчёт

После проверки всех страниц вывести сводку. По каждой странице — статус для desktop и mobile:

```
## /login
- Desktop 1440×900: ✅ нет проблем / ⚠️ / ❌ (описание)
- Mobile 390×844:  ✅ / ⚠️ / ❌ (описание)
```

Формат: в начале сводка «проблемных» страниц (❌/⚠️), затем постранично только проблемные места с описанием. Чистые страницы отметить коротко одной строкой. Каждую найденную проблему описать конкретно: где, что сломано, в каком вьюпорте. Не менять код — только диагностика.

## Запрещено

- Не редактировать компоненты/стили в ходе проверки — skill только диагностирует
- Не выходить за пределы dev-сервера localhost:3000 без явной просьбы
- Не делать скриншоты/навигацию на прод-окружение
