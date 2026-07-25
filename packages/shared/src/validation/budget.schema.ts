import { z } from "zod";

export const budgetPeriodEnum = z.enum(["WEEKLY", "MONTHLY", "YEARLY"]);

export const createBudgetSchema = z.object({
  name: z.string().min(1),
  amount: z.number().positive(),
  period: budgetPeriodEnum,
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  categoryId: z.string().uuid(),
});

export const updateBudgetSchema = z.object({
  name: z.string().min(1).optional(),
  amount: z.number().positive().optional(),
  period: budgetPeriodEnum.optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
