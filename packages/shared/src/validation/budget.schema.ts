import { z } from "zod";

/**
 * Схемы валидации Zod для бюджетов.
 * Включает enum периодов бюджета и схемы для создания/обновления.
 */

/** Enum периодов бюджета для валидации */
export const budgetPeriodEnum = z.enum(["WEEKLY", "MONTHLY", "YEARLY"]);

/**
 * Схема валидации создания нового бюджета.
 * Требует название, положительную сумму, период и идентификатор категории.
 */
export const createBudgetSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  period: budgetPeriodEnum,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().uuid(),
});

/**
 * Схема валидации обновления существующего бюджета.
 * Все поля опциональны.
 */
export const updateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  period: budgetPeriodEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
