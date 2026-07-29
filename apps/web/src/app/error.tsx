/**
 * Глобальная страница ошибки (`/error`).
 * Запасной UI, отображаемый при возникновении неожиданной ошибки
 * в корневом сегменте. Показывает сообщение об ошибке и кнопку
 * для повторной попытки.
 */
"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

/**
 * Граница ошибки для корневого маршрута.
 * Отображает сообщение об ошибке и предлагает повторить попытку.
 *
 * @param error - Объект ошибки с опциональным digest-идентификатором.
 * @param reset - Функция для сброса состояния ошибки и повторной попытки рендера.
 * @returns JSX-разметка страницы ошибки.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-destructive/10 p-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            Something went wrong
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      </div>
      <Button onClick={reset} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}
