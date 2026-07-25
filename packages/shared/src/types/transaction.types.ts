export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: string | null;
  accountId: string;
  toAccountId: string | null;
  userId: string;
  createdAt: string;
}

export interface CreateTransactionDto {
  amount: number;
  type: TransactionType;
  description?: string;
  date?: string;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
}

export interface UpdateTransactionDto {
  amount?: number;
  type?: TransactionType;
  description?: string;
  date?: string;
  categoryId?: string;
}

export interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  type?: TransactionType;
  page?: number;
  limit?: number;
}
