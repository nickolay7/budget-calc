import { create } from "zustand";
import type { UserProfile } from "@budget-calc/shared";
import { apiClient, publicClient, setTokens, clearTokens, getAccessToken } from "@/shared/api/api-client";

/**
 * Интерфейс состояния аутентификации.
 *
 * @property user - Данные текущего пользователя или null.
 * @property isAuthenticated - Флаг авторизации пользователя.
 * @property isLoading - Флаг загрузки (вход, проверка токена).
 * @property error - Текст ошибки или null.
 */
interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /** Выполняет вход пользователя по email и паролю. */
  login: (email: string, password: string) => Promise<void>;
  /** Регистрирует нового пользователя. */
  register: (email: string, name: string, password: string) => Promise<void>;
  /** Выполняет выход: очищает токены и сбрасывает состояние. */
  logout: () => void;
  /** Проверяет валидность токена и загружает профиль пользователя. */
  checkAuth: () => Promise<void>;
  /** Очищает текст ошибки. */
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await publicClient().post<{
        accessToken: string;
        refreshToken: string;
        user: UserProfile;
      }>("/api/auth/login", { email, password });

      setTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.message ?? "Login failed";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  register: async (email, name, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await publicClient().post<{
        accessToken: string;
        refreshToken: string;
        user: UserProfile;
      }>("/api/auth/register", { email, name, password });

      setTokens(data.accessToken, data.refreshToken);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
    } catch (err: any) {
      const message = err.message ?? "Registration failed";
      set({ isLoading: false, error: message });
      throw err;
    }
  },

  logout: () => {
    clearTokens();
    set({ user: null, isAuthenticated: false, error: null });
  },

  checkAuth: async () => {
    const token = getAccessToken();
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await apiClient().get<UserProfile>("/api/users/me");
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      clearTokens();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
