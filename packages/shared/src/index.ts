/**
 * Пакет shared — общие типы, схемы валидации Zod, константы и утилиты
 * для приложения Budget Calc. Импортируется клиентской и серверной частями.
 *
 * @module @budget-calc/shared
 */

export * from "./types/user.types";
export * from "./types/transaction.types";
export * from "./types/category.types";
export * from "./types/budget.types";
export * from "./types/account.types";
export * from "./types/api.types";
export * from "./types/stats.types";
export * from "./validation/user.schema";
export * from "./validation/transaction.schema";
export * from "./validation/category.schema";
export * from "./validation/budget.schema";
export * from "./validation/account.schema";
export * from "./constants";
export * from "./utils";
