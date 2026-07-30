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
 * Боковая панель навигации с тёмным градиентным фоном.
 *
 * Отображает логотип, навигационные пункты с подсветкой активного,
 * информацию о пользователе и кнопку выхода.
 *
 * Состояния рендеринга:
 * - Пользователь авторизован: отображает имя, email и кнопку Logout.
 * - Пользователь не авторизован: скрывает блок с пользователем.
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
    <aside className="flex w-64 flex-col bg-gradient-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white shadow-lg backdrop-blur-sm">
          B
        </div>
        <span className="text-base font-semibold tracking-tight text-white">
          Budget Calc
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-white/60 hover:bg-white/5 hover:text-white/90",
              )}
            >
              {/* Active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white" />
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
      <div className="px-3 pb-4">
        {user && (
          <div className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">
                {user.name ?? "User"}
              </p>
              <p className="truncate text-xs text-white/70">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 rounded-xl text-white/50 hover:bg-white/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
