/**
 * Страница управления счетами (`/accounts`).
 * Отображает заголовок, общую сумму баланса (капитал),
 * и карточки каждого счёта с типом и остатком.
 */
"use client";

import {
  Wallet,
  Plus,
  CreditCard,
  Building2,
  Landmark,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { cn } from "@/shared/lib/cn";

const accounts = [
  {
    name: "Main Checking",
    type: "Checking",
    balance: 5840.0,
    icon: Building2,
    color: "text-brand",
    bg: "bg-brand/10",
    gradient: "from-brand/20 via-brand/5 to-transparent",
  },
  {
    name: "Savings Account",
    type: "Savings",
    balance: 12400.0,
    icon: Landmark,
    color: "text-income",
    bg: "bg-income/10",
    gradient: "from-income/20 via-income/5 to-transparent",
  },
  {
    name: "Travel Rewards",
    type: "Credit Card",
    balance: -1240.5,
    icon: CreditCard,
    color: "text-expense",
    bg: "bg-expense/10",
    gradient: "from-expense/20 via-expense/5 to-transparent",
  },
  {
    name: "Cash Wallet",
    type: "Cash",
    balance: 320.75,
    icon: Wallet,
    color: "text-primary",
    bg: "bg-primary/10",
    gradient: "from-primary/20 via-primary/5 to-transparent",
  },
];

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
 * Показывает общую сумму капитала и карточки каждого счёта
 * с названием, типом, остатком и иконкой.
 *
 * @returns JSX-разметка страницы счетов.
 */
export default function AccountsPage() {
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + acc.balance,
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
        <Button>
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* ── Total Balance Card ── */}
      <Card className="bg-gradient-to-br from-primary to-brand text-primary-foreground">
        <CardContent className="py-6">
          <p className="text-sm font-medium text-white/70">
            Total Net Worth
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {formatCurrency(totalBalance)}
          </p>
          <p className="mt-1 text-xs text-white/50">
            Across {accounts.length} accounts
          </p>
        </CardContent>
      </Card>

      {/* ── Account Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((account, i) => {
          const Icon = account.icon;
          const isNegative = account.balance < 0;
          return (
            <Card
              key={account.name}
              className={cn(
                "card-hover animate-slide-up relative overflow-hidden",
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Gradient overlay */}
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-gradient-to-br",
                  account.gradient,
                )}
              />
              <CardHeader className="relative">
                <div className="flex items-start justify-between">
                  <div className={cn("rounded-lg p-2", account.bg)}>
                    <Icon className={cn("h-5 w-5", account.color)} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
                <CardTitle className="mt-1 text-base">{account.name}</CardTitle>
                <CardDescription>{account.type}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p
                  className={cn(
                    "text-2xl font-bold tracking-tight",
                    isNegative && "text-expense",
                  )}
                >
                  {isNegative ? "-" : ""}
                  {formatCurrency(Math.abs(account.balance))}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
