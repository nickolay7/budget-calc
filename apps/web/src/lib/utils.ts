/**
 * Форматирует число как валюту.
 *
 * @param amount - Сумма для форматирования.
 * @param currency - Код валюты (по умолчанию "USD").
 * @returns Отформатированная строка с валютой.
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Форматирует дату в локализованный строковый формат.
 *
 * @param date - Дата в формате Date или строки.
 * @returns Отформатированная строка даты (например, "Jan 1, 2024").
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
