/**
 * Компонент шапки приложения.
 *
 * Отображает название приложения "Budget Calc" в верхней части страницы.
 * Используется в качестве резервной шапки для страниц без AppShell.
 *
 * @returns JSX-разметка шапки.
 */
export function Header() {
  return (
    <header className="border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Budget Calc</h1>
      </div>
    </header>
  );
}
