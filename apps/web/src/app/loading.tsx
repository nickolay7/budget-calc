/**
 * Корневая страница загрузки (`/loading`).
 * Отображает анимированный спиннер с текстом "Loading..."
 * во время загрузки корневого сегмента приложения.
 *
 * @returns JSX-разметка с индикатором загрузки.
 */
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground animate-pulse-soft">
          Loading...
        </p>
      </div>
    </div>
  );
}

