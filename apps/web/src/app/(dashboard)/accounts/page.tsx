/**
 * Страница управления счетами (`/accounts`).
 * Отображает заголовок с кнопкой создания нового счёта,
 * общую сумму баланса (капитал) и список счетов `AccountList`.
 */
"use client";

import { Wallet, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
} from "@/shared/ui/card";
import { useAccountsStore } from "@/entities/accounts";
import { AccountList } from "@/features/accounts/ui/AccountList";

/**
 * Форматирует число как валюту (USD).
 *
 * @param amount - Сумма для форматирования.
 * @returns Строка с отформатированной валютой (например, "$1,234.56").
 */
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

/**
 * Страница со списком финансовых счетов пользователя.
 * Показывает общую сумму капитала и карточки каждого счёта.
 *
 * @returns JSX-разметка страницы счетов.
 */
export default function AccountsPage() {
  const accounts = useAccountsStore((s) => s.accounts);
  const isLoading = useAccountsStore((s) => s.isLoading);

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0,
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <Wallet className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Manage your bank accounts, cards, and wallets
          </p>
        </div>
        <Button asChild>
          <Link href="/accounts/new">
            <Plus className="h-4 w-4" />
            Add Account
          </Link>
        </Button>
      </div>

      {/* ── Total Balance Card ── */}
      <Card className="bg-gradient-to-br from-primary to-brand text-primary-foreground">
        <CardContent className="py-6">
          <p className="text-sm font-medium text-white/70">
            Total Net Worth
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {isLoading ? "—" : formatCurrency(totalBalance)}
          </p>
          <p className="mt-1 text-xs text-white/50">
            Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
          </p>
        </CardContent>
      </Card>

      {/* ── Account Cards ── */}
      <AccountList />
    </div>
  );
}