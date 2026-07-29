import { z } from "zod";

/**
 * Схемы валидации Zod для категорий транзакций.
 * Включает схемы для создания и обновления категорий с проверкой HEX-цвета.
 */

/**
 * Схема валидации создания новой категории.
 * Требует название. Цвет проверяется регулярным выражением HEX (#RRGGBB).
 */
export const createCategorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

/**
 * Схема валидации обновления категории.
 * Все поля опциональны. Цвет проверяется регулярным выражением HEX (#RRGGBB).
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
