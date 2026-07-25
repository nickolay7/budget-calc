import { z } from "zod";

export const accountTypeEnum = z.enum([
  "CASH",
  "DEBIT_CARD",
  "CREDIT_CARD",
  "SAVINGS",
  "ELECTRONIC",
]);

export const createAccountSchema = z.object({
  name: z.string().min(1),
  type: accountTypeEnum,
  balance: z.number().min(0).optional(),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1).optional(),
  type: accountTypeEnum.optional(),
  balance: z.number().min(0).optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
