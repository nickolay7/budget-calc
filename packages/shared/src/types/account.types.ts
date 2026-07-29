/**
 * Типы данных, связанные со счетами пользователя.
 * Содержит типы счетов, интерфейс счёта, DTO для создания и обновления.
 */

/** Тип финансового счёта: наличные, дебетовая/кредитная карта, накопления, электронный */
export type AccountType =
  | "CASH"
  | "DEBIT_CARD"
  | "CREDIT_CARD"
  | "SAVINGS"
  | "ELECTRONIC";

/** Финансовый счёт пользователя */
export interface Account {
  /** Уникальный идентификатор счёта */
  id: string;
  /** Название счёта */
  name: string;
  /** Тип счёта */
  type: AccountType;
  /** Текущий баланс */
  balance: number;
  /** Валюта счёта (например, USD) */
  currency: string;
  /** Идентификатор пользователя-владельца */
  userId: string;
  /** Дата создания */
  createdAt: string;
}

/** DTO для создания нового счёта */
export interface CreateAccountDto {
  /** Название счёта */
  name: string;
  /** Тип счёта */
  type: AccountType;
  /** Начальный баланс (опционально, по умолчанию 0) */
  balance?: number;
}

/** DTO для обновления существующего счёта */
export interface UpdateAccountDto {
  /** Новое название (опционально) */
  name?: string;
  /** Новый тип (опционально) */
  type?: AccountType;
  /** Новый баланс (опционально) */
  balance?: number;
}
