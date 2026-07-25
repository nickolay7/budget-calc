export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface Budget {
  id: string;
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string | null;
  categoryId: string;
  userId: string;
  createdAt: string;
}

export interface BudgetWithProgress extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface CreateBudgetDto {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate?: string;
  endDate?: string;
  categoryId: string;
}

export interface UpdateBudgetDto {
  name?: string;
  amount?: number;
  period?: BudgetPeriod;
  startDate?: string;
  endDate?: string;
}
