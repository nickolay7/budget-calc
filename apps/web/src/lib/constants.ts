/**
 * Базовый URL API-сервера.
 * Берётся из переменной окружения NEXT_PUBLIC_API_URL,
 * по умолчанию http://localhost:3001.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Название приложения.
 */
export const APP_NAME = "Budget Calc";
