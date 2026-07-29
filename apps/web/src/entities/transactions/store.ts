import { create } from "zustand";
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryParams,
  TransactionStats,
  PaginatedResponse,
} from "@budget-calc/shared";
import { apiClient } from "@/shared/api/api-client";

/**
 * Интерфейс состояния транзакций.
 *
 * @property transactions - Список транзакций.
 * @property currentTransaction - Текущая выбранная транзакция или null.
 * @property stats - Статистика по транзакциям или null.
 * @property isLoading - Флаг загрузки списка / одной транзакции.
 * @property isStatsLoading - Флаг загрузки статистики.
 * @property error - Текст ошибки или null.
 * @property meta - Метаданные пагинации (total, page, totalPages).
 */
interface TransactionsState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  stats: TransactionStats | null;
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  meta: PaginatedResponse<Transaction>["meta"] | null;

  /** Загружает список транзакций с фильтрацией и пагинацией. */
  fetchAll: (params?: TransactionQueryParams) => Promise<void>;
  /** Загружает одну транзакцию по ID. */
  fetchOne: (id: string) => Promise<void>;
  /** Создаёт новую транзакцию и обновляет список. */
  create: (dto: CreateTransactionDto) => Promise<Transaction>;
  /** Обновляет существующую транзакцию и обновляет список. */
  update: (id: string, dto: UpdateTransactionDto) => Promise<Transaction>;
  /** Удаляет транзакцию по ID и обновляет список. */
  remove: (id: string) => Promise<void>;
  /** Загружает статистику по транзакциям. */
  fetchStats: (params?: TransactionQueryParams) => Promise<void>;
  /** Очищает текст ошибки. */
  clearError: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: [],
  currentTransaction: null,
  stats: null,
  isLoading: false,
  isStatsLoading: false,
  error: null,
  meta: null,

  fetchAll: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.set("startDate", params.startDate);
      if (params?.endDate) searchParams.set("endDate", params.endDate);
      if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
      if (params?.accountId) searchParams.set("accountId", params.accountId);
      if (params?.type) searchParams.set("type", params.type);
      if (params?.page) searchParams.set("page", String(params.page));
      if (params?.limit) searchParams.set("limit", String(params.limit));

      const qs = searchParams.toString();
      const path = qs ? `/api/transactions?${qs}` : "/api/transactions";

      const response = await apiClient().get<PaginatedResponse<Transaction>>(path);
      set({
        transactions: response.data,
        meta: response.meta,
        isLoading: false,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message ?? "Failed to load transactions",
      });
    }
  },

  fetchOne: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const transaction = await apiClient().get<Transaction>(
        `/api/transactions/${id}`,
      );
      set({ currentTransaction: transaction, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message ?? "Failed to load transaction",
      });
    }
  },

  create: async (dto) => {
    set({ error: null });
    try {
      const transaction = await apiClient().post<Transaction>(
        "/api/transactions",
        dto,
      );
      // Refetch list to stay in sync
      const { fetchAll } = get();
      await fetchAll();
      return transaction;
    } catch (err: any) {
      set({ error: err.message ?? "Failed to create transaction" });
      throw err;
    }
  },

  update: async (id, dto) => {
    set({ error: null });
    try {
      const transaction = await apiClient().patch<Transaction>(
        `/api/transactions/${id}`,
        dto,
      );
      set({ currentTransaction: transaction });
      // Refetch list to stay in sync
      const { fetchAll } = get();
      await fetchAll();
      return transaction;
    } catch (err: any) {
      set({ error: err.message ?? "Failed to update transaction" });
      throw err;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await apiClient().del(`/api/transactions/${id}`);
      set({ currentTransaction: null });
      // Refetch list to stay in sync
      const { fetchAll } = get();
      await fetchAll();
    } catch (err: any) {
      set({ error: err.message ?? "Failed to delete transaction" });
      throw err;
    }
  },

  fetchStats: async (params) => {
    set({ isStatsLoading: true, error: null });
    try {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.set("startDate", params.startDate);
      if (params?.endDate) searchParams.set("endDate", params.endDate);
      if (params?.categoryId) searchParams.set("categoryId", params.categoryId);
      if (params?.accountId) searchParams.set("accountId", params.accountId);
      if (params?.type) searchParams.set("type", params.type);

      const qs = searchParams.toString();
      const path = qs ? `/api/transactions/stats?${qs}` : "/api/transactions/stats";

      const stats = await apiClient().get<TransactionStats>(path);
      set({ stats, isStatsLoading: false });
    } catch (err: any) {
      set({
        isStatsLoading: false,
        error: err.message ?? "Failed to load stats",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
