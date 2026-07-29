"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/auth";
import { Button } from "@/shared/ui/button";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Tags,
  PiggyBank,
  Wallet,
  Settings,
  LogOut,
  User,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowRightLeft },
  { href: "/categories", label: "Categories", icon: Tags },
  { href: "/budgets", label: "Budgets", icon: PiggyBank },
  { href: "/accounts", label: "Accounts", icon: Wallet },
  { href: "/settings", label: "Settings", icon: Settings },
];

/**
 * Компонент боковой панели навигации.
 *
 * Отображает логотип, список навигационных пунктов (Dashboard, Transactions,
 * Categories, Budgets, Accounts, Settings) с подсветкой активного пункта,
 * информацию о текущем пользователе и кнопку выхода.
 *
 * Состояния рендеринга:
 * - Пользователь авторизован: отображает имя, email и кнопку Logout.
 * - Пользователь не авторизован: скрывает блок с информацией о пользователе.
 *
 * @returns JSX-разметка боковой панели.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-brand text-sm font-bold text-primary-foreground shadow-sm">
          B
        </div>
        <span className="text-base font-semibold tracking-tight">
          <span className="gradient-text">Budget</span> Calc
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-muted hover:bg-accent hover:text-accent-foreground",
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
              )}
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-transform duration-200",
                  !active && "group-hover:scale-110",
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User info + Logout */}
      <div className="border-t p-3">
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name ?? "User"}
              </p>
              <p className="truncate text-xs text-sidebar-muted">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-sidebar-muted hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
