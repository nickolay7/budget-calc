import { create } from "zustand";
import type {
  Account,
  CreateAccountDto,
} from "@budget-calc/shared";
import { apiClient } from "@/shared/api/api-client";

/**
 * Интерфейс состояния счетов.
 *
 * @property accounts - Список счетов пользователя.
 * @property isLoading - Флаг загрузки списка.
 * @property isCreating - Флаг выполнения запроса на создание.
 * @property error - Текст ошибки или null.
 */
interface AccountsState {
  accounts: Account[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;

  /** Загружает список счетов пользователя. */
  fetchAll: () => Promise<void>;
  /** Создаёт новый счёт и обновляет список. */
  create: (dto: CreateAccountDto) => Promise<Account>;
  /** Удаляет счёт по ID и обновляет список. */
  remove: (id: string) => Promise<void>;
  /** Очищает текст ошибки. */
  clearError: () => void;
}

export const useAccountsStore = create<AccountsState>((set, get) => ({
  accounts: [],
  isLoading: false,
  isCreating: false,
  error: null,

  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const accounts = await apiClient().get<Account[]>("/api/accounts");
      set({ accounts, isLoading: false });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message ?? "Failed to load accounts",
      });
    }
  },

  create: async (dto) => {
    set({ isCreating: true, error: null });
    try {
      const account = await apiClient().post<Account>("/api/accounts", dto);
      // Refetch list to stay in sync
      const { fetchAll } = get();
      await fetchAll();
      set({ isCreating: false });
      return account;
    } catch (err: any) {
      set({
        isCreating: false,
        error: err.message ?? "Failed to create account",
      });
      throw err;
    }
  },

  remove: async (id) => {
    set({ error: null });
    try {
      await apiClient().del(`/api/accounts/${id}`);
      await get().fetchAll();
    } catch (err: any) {
      set({ error: err.message ?? "Failed to delete account" });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));