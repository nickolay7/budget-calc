export const TRANSACTION_TYPES = ["INCOME", "EXPENSE", "TRANSFER"] as const;
export const ACCOUNT_TYPES = [
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "SAVINGS",
  "ELECTRONIC",
] as const;
export const BUDGET_PERIODS = ["WEEKLY", "MONTHLY", "YEARLY"] as const;

export const DEFAULT_CURRENCY = "USD";

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
