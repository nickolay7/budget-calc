export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

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

export function calculateBudgetProgress(spent: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(Math.round((spent / total) * 100), 100);
}
