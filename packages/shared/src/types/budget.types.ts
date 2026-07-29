/**
 * Типы данных, связанные с бюджетами.
 * Содержит периоды бюджета, интерфейсы бюджета с прогрессом,
 * DTO для создания и обновления.
 */

/** Период бюджета: неделя, месяц, год */
export type BudgetPeriod = "WEEKLY" | "MONTHLY" | "YEARLY";

/** Бюджет — лимит расходов по категории за период */
export interface Budget {
  /** Уникальный идентификатор бюджета */
  id: string;
  /** Название бюджета */
  name: string;
  /** Лимит бюджета в валюте */
  amount: number;
  /** Период действия бюджета */
  period: BudgetPeriod;
  /** Дата начала периода */
  startDate: string;
  /** Дата окончания периода (может быть null для бессрочных) */
  endDate: string | null;
  /** Идентификатор категории, к которой привязан бюджет */
  categoryId: string;
  /** Идентификатор пользователя-владельца */
  userId: string;
  /** Дата создания */
  createdAt: string;
}

/** Бюджет с вычисленной информацией о прогрессе исполнения */
export interface BudgetWithProgress extends Budget {
  /** Фактически потраченная сумма */
  spent: number;
  /** Оставшаяся сумма (лимит минус потрачено) */
  remaining: number;
  /** Процент исполнения бюджета (0–100) */
  percentage: number;
}

/** DTO для создания нового бюджета */
export interface CreateBudgetDto {
  /** Название бюджета */
  name: string;
  /** Лимит бюджета */
  amount: number;
  /** Период бюджета */
  period: BudgetPeriod;
  /** Дата начала (опционально, по умолчанию начало текущего периода) */
  startDate?: string;
  /** Дата окончания (опционально) */
  endDate?: string;
  /** Идентификатор категории */
  categoryId: string;
}

/** DTO для обновления существующего бюджета */
export interface UpdateBudgetDto {
  /** Новое название (опционально) */
  name?: string;
  /** Новый лимит (опционально) */
  amount?: number;
  /** Новый период (опционально) */
  period?: BudgetPeriod;
  /** Новая дата начала (опционально) */
  startDate?: string;
  /** Новая дата окончания (опционально) */
  endDate?: string;
}
