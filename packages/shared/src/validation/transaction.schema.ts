import { z } from "zod";

/**
 * Схемы валидации Zod для транзакций.
 * Включает enum типов транзакций и схемы для создания/обновления.
 */

/** Enum типов транзакций для валидации */
export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);

/**
 * Схема валидации создания новой транзакции.
 * Требует положительную сумму, тип, идентификатор счёта.
 * Опционально: описание, дата, категория, счёт назначения.
 */
export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: transactionTypeEnum,
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  accountId: z.string().uuid(),
  toAccountId: z.string().uuid().optional(),
});

/**
 * Схема валидации обновления существующей транзакции.
 * Все поля опциональны.
 */
export const updateTransactionSchema = z.object({
  amount: z.number().positive().optional(),
  type: transactionTypeEnum.optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  accountId: z.string().uuid().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
