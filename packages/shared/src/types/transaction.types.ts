/**
 * Типы данных, связанные с транзакциями.
 * Содержит тип транзакции (доход/расход/перевод), интерфейс транзакции,
 * DTO для создания/обновления и параметры фильтрации/пагинации.
 */

/** Тип транзакции: доход, расход или перевод между счетами */
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

/** Транзакция — запись о движении средств */
export interface Transaction {
  /** Уникальный идентификатор транзакции */
  id: string;
  /** Сумма транзакции */
  amount: number;
  /** Тип транзакции */
  type: TransactionType;
  /** Описание транзакции (может быть null) */
  description: string | null;
  /** Дата транзакции */
  date: string;
  /** Идентификатор категории (может быть null) */
  categoryId: string | null;
  /** Идентификатор счёта-источника */
  accountId: string;
  /** Идентификатор счёта-назначения для переводов (может быть null) */
  toAccountId: string | null;
  /** Идентификатор пользователя-владельца */
  userId: string;
  /** Дата создания записи */
  createdAt: string;
}

/** DTO для создания новой транзакции */
export interface CreateTransactionDto {
  /** Сумма транзакции (положительное число) */
  amount: number;
  /** Тип транзакции */
  type: TransactionType;
  /** Описание транзакции (опционально) */
  description?: string;
  /** Дата транзакции (опционально, по умолчанию текущая) */
  date?: string;
  /** Идентификатор категории (опционально) */
  categoryId?: string;
  /** Идентификатор счёта-источника */
  accountId: string;
  /** Идентификатор счёта-назначения для переводов (опционально) */
  toAccountId?: string;
}

/** DTO для обновления существующей транзакции */
export interface UpdateTransactionDto {
  /** Новая сумма (опционально) */
  amount?: number;
  /** Новый тип (опционально) */
  type?: TransactionType;
  /** Новое описание (опционально) */
  description?: string;
  /** Новая дата (опционально) */
  date?: string;
  /** Новая категория (опционально) */
  categoryId?: string;
}

/** Параметры запроса для фильтрации и пагинации списка транзакций */
export interface TransactionQueryParams {
  /** Начальная дата фильтра */
  startDate?: string;
  /** Конечная дата фильтра */
  endDate?: string;
  /** Фильтр по категории */
  categoryId?: string;
  /** Фильтр по счету */
  accountId?: string;
  /** Фильтр по типу транзакции */
  type?: TransactionType;
  /** Номер страницы для пагинации */
  page?: number;
  /** Количество записей на странице */
  limit?: number;
}
