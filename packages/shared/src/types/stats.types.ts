export interface CategoryStat {
  categoryId: string | null;
  categoryName: string;
  categoryIcon: string | null;
  total: number;
  count: number;
}

export interface MonthlyStat {
  month: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  total: number;
  count: number;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  totalTransactions: number;
  byCategory: CategoryStat[];
  byMonth: MonthlyStat[];
}

export interface BudgetProgressItem {
  budgetId: string;
  budgetName: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percentage: number;
  period: "MONTHLY" | "WEEKLY" | "YEARLY";
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryColor: string | null;
}
