/**
 * Провайдер аутентификации.
 * При монтировании вызывает `checkAuth` для проверки текущего статуса
 * аутентификации пользователя через API. Не блокирует рендер дочерних
 * компонентов.
 */
"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/entities/auth";

/**
 * Провайдер аутентификации для приложения.
 * Запускает проверку авторизации при первом монтировании.
 * Оборачивает дочерние элементы без добавления дополнительной DOM-обёртки.
 *
 * @param children - Дочерние компоненты, которые получают контекст аутентификации.
 * @returns Фрагмент с дочерними элементами.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
