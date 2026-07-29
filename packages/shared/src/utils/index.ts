/**
 * Утилиты для форматирования валюты, дат, вычисления периодов
 * и прогресса бюджета.
 */

/**
 * Форматирует число как валютную строку с использованием Intl.NumberFormat.
 *
 * @param amount - Сумма для форматирования
 * @param currency - Код валюты (по умолчанию "USD")
 * @returns Отформатированная строка с валютой, например "$1,234.56"
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Форматирует дату в читаемый строковый формат (например, "Jan 1, 2024").
 *
 * @param date - Дата в виде объекта Date или строки
 * @returns Отформатированная строка даты
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Возвращает даты начала и конца периода (неделя/месяц/год).
 *
 * @param period - Тип периода: "WEEKLY" | "MONTHLY" | "YEARLY"
 * @param reference - Опорная дата (по умолчанию текущая)
 * @returns Объект с датами start и end
 */
export function getPeriodDates(period: string, reference?: Date) {
  const now = reference ?? new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  switch (period) {
    case "MONTHLY":
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0),
      };
    case "WEEKLY": {
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      return {
        start: new Date(now.setDate(diff)),
        end: new Date(now.setDate(diff + 6)),
      };
    }
    case "YEARLY":
      return {
        start: new Date(year, 0, 1),
        end: new Date(year, 11, 31),
      };
    default:
      return { start: new Date(0), end: new Date() };
  }
}

/**
 * Вычисляет процент исполнения бюджета.
 *
 * @param spent - Потраченная сумма
 * @param total - Общий лимит бюджета
 * @returns Процент исполнения (0–100). Если total <= 0, возвращает 0.
 */
export function calculateBudgetProgress(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}
