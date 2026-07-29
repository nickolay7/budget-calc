import { z } from "zod";

/**
 * Схема валидации регистрации нового пользователя.
 * Требует email, имя (мин. 3 символа) и пароль (мин. 6 символов).
 */
export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(6),
});

/**
 * Схема валидации обновления профиля пользователя.
 * Все поля опциональны.
 */
export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(3).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

/**
 * Схема валидации входа в систему.
 * Требует email и пароль.
 */
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Схема валидации запроса восстановления пароля.
 * Требует валидный email.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Схема валидации сброса пароля с токеном подтверждения.
 * Содержит проверку совпадения password и confirmPassword через .refine().
 */
export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
