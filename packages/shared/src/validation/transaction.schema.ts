import { z } from "zod";

export const transactionTypeEnum = z.enum(["INCOME", "EXPENSE", "TRANSFER"]);

export const createTransactionSchema = z.object({
  amount: z.number().positive(),
  type: transactionTypeEnum,
  description: z.string().optional(),
  date: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  accountId: z.string().uuid(),
  toAccountId: z.string().uuid().optional(),
});

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
