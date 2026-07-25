export type AccountType =
  | "CASH"
  | "DEBIT_CARD"
  | "CREDIT_CARD"
  | "SAVINGS"
  | "ELECTRONIC";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  userId: string;
  createdAt: string;
}

export interface CreateAccountDto {
  name: string;
  type: AccountType;
  balance?: number;
}

export interface UpdateAccountDto {
  name?: string;
  type?: AccountType;
  balance?: number;
}
