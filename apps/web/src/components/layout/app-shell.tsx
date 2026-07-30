"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { cn } from "@/shared/lib/cn";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/transactions": "Transactions",
  "/transactions/new": "New Transaction",
  "/categories": "Categories",
  "/budgets": "Budgets",
  "/accounts": "Accounts",
  "/settings": "Settings",
};

/**
 * Основная оболочка приложения.
 *
 * Отображает Sidebar слева и область контента с динамическим заголовком
 * страницы, который определяется на основе текущего пути (usePathname).
 *
 * Состояния рендеринга: всегда показывает сайдбар + контент.
 *
 * @param children - Дочерние элементы, отображаемые в области контента.
 * @returns JSX-разметка основной оболочки приложения.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ??
    pageTitles[
      Object.keys(pageTitles).find((k) => k !== "/" && pathname.startsWith(k)) ??
        ""
    ] ??
    "Budget Calc";

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex flex-1 flex-col">
        {/* Page header */}
        <header className="flex h-16 items-center justify-between bg-background px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {/* Page content */}
        <div className={cn("flex-1 p-6", "animate-fade-in")}>{children}</div>
      </main>
    </div>
  );
}
