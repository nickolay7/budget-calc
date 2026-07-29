/**
 * Типы данных для статистики и прогресса бюджета.
 * Содержит интерфейсы для агрегированных данных по категориям и месяцам,
 * а также для отчёта о прогрессе бюджетов.
 */

/** Статистика по отдельной категории транзакций */
export interface CategoryStat {
  /** Идентификатор категории (может быть null для некатегоризированных) */
  categoryId: string | null;
  /** Название категории */
  categoryName: string;
  /** Иконка категории (может быть null) */
  categoryIcon: string | null;
  /** Общая сумма по категории */
  total: number;
  /** Количество транзакций в категории */
  count: number;
}

/** Статистика за месяц по типу транзакций */
export interface MonthlyStat {
  /** Месяц в формате YYYY-MM */
  month: string;
  /** Тип транзакции */
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  /** Общая сумма за месяц */
  total: number;
  /** Количество транзакций за месяц */
  count: number;
}

/** Агрегированная статистика по транзакциям */
export interface TransactionStats {
  /** Общий доход */
  totalIncome: number;
  /** Общий расход */
  totalExpense: number;
  /** Чистая сумма (доход минус расход) */
  netAmount: number;
  /** Общее количество транзакций */
  totalTransactions: number;
  /** Разбивка по категориям */
  byCategory: CategoryStat[];
  /** Разбивка по месяцам */
  byMonth: MonthlyStat[];
}

/** Элемент отчёта о прогрессе бюджета */
export interface BudgetProgressItem {
  /** Идентификатор бюджета */
  budgetId: string;
  /** Название бюджета */
  budgetName: string;
  /** Лимит бюджета */
  budgetAmount: number;
  /** Фактически потраченная сумма */
  spent: number;
  /** Оставшаяся сумма */
  remaining: number;
  /** Процент исполнения (0–100) */
  percentage: number;
  /** Период бюджета */
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
  /** Идентификатор категории */
  categoryId: string;
  /** Название категории */
  categoryName: string;
  /** Иконка категории (может быть null) */
  categoryIcon: string | null;
  /** Цвет категории в HEX (может быть null) */
  categoryColor: string | null;
}
