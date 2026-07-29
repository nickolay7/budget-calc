import { AppShell } from "@/components/layout/app-shell";

/**
 * Макет для маршрутов панели управления (`/(dashboard)/*`).
 * Оборачивает дочерние страницы в `AppShell`, который предоставляет
 * боковую панель навигации и общую структуру дашборда.
 *
 * @param children - Дочерние компоненты (страница дашборда).
 * @returns Страницу, обёрнутую в AppShell.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
