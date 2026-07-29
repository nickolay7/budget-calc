/**
 * Состояние загрузки панели управления (`/loading`).
 * Отображает скелетоны-заглушки для заголовка, сетки статистики
 * и таблицы недавних транзакций.
 */
"use client";

import { cn } from "@/shared/lib/cn";

/**
 * Компонент-скелетон для индикации загрузки.
 * Создаёт анимированную прямоугольную заглушку с заданными классами.
 *
 * @param className - Дополнительные CSS-классы для настройки размеров.
 * @returns Анимированный блок-заглушка.
 */
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className,
      )}
    />
  );
}

/**
 * Страница загрузки дашборда с анимированными скелетонами.
 * Повторяет структуру основной страницы: заголовок, четыре карточки
 * статистики и таблица из пяти строк.
 *
 * @returns JSX-разметка скелетона дашборда.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-4 h-7 w-28" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="space-y-1 p-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="mt-1 h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
