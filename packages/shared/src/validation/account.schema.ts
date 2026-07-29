import { z } from "zod";

/**
 * Схемы валидации Zod для счетов пользователя.
 * Включает enum типов счетов и схемы для создания/обновления.
 */

/** Enum типов счетов для валидации */
export const accountTypeEnum = z.enum([
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "SAVINGS",
  "ELECTRONIC",
]);

/**
 * Схема валидации создания нового счёта.
 * Требует название и тип. Баланс опционален (по умолчанию 0).
 */
export const createAccountSchema = z.object({
  name: z.string().min(1),
  type: accountTypeEnum,
  balance: z.number().min(0).optional(),
});

/**
 * Схема валидации обновления существующего счёта.
 * Все поля опциональны.
 */
export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  type: accountTypeEnum.optional(),
  balance: z.number().min(0).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
