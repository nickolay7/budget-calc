"use client";

import { useEffect } from "react";
import {
  Wallet,
  CreditCard,
  Landmark,
  Smartphone,
  MoreHorizontal,
} from "lucide-react";
import type { Account, AccountType } from "@budget-calc/shared";
import { useAccountsStore } from "@/entities/accounts";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/cn";

/** Иконка и палитра для каждого типа счёта. */
const ACCOUNT_META: Record<
  AccountType,
  { icon: typeof Wallet; color: string; gradient: string }
> = {
  CASH: {
    icon: Wallet,
    color: "text-primary",
    gradient: "from-primary/20 via-primary/5 to-transparent",
  },
  DEBIT_CARD: {
    icon: CreditCard,
    color: "text-brand",
    gradient: "from-brand/20 via-brand/5 to-transparent",
  },
  CREDIT_CARD: {
    icon: CreditCard,
    color: "text-expense",
    gradient: "from-expense/20 via-expense/5 to-transparent",
  },
  SAVINGS: {
    icon: Landmark,
    color: "text-income",
    gradient: "from-income/20 via-income/5 to-transparent",
  },
  ELECTRONIC: {
    icon: Smartphone,
    color: "text-brand",
    gradient: "from-brand/20 via-brand/5 to-transparent",
  },
};

/**
 * Форматирует число как валюту счёта.
 *
 * @param amount - Сумма для форматирования.
 * @param currency - Код валюты (например, "USD").
 * @returns Строка с отформатированной валютой (например, "$1,234.56").
 */
function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
}

/**
 * Карточка-заглушка на время загрузки списка счетов.
 */
function AccountCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className="card-hover relative overflow-hidden border-0 shadow-sm"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <Skeleton className="h-6 w-6 rounded-md" />
        </div>
        <Skeleton className="mt-2 h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-7 w-1/2" />
      </CardContent>
    </Card>
  );
}

/**
 * Карточка одного счёта с иконкой, названием, типом и остатком.
 */
function AccountCard({ account, index }: { account: Account; index: number }) {
  const Icon = ACCOUNT_META[account.type]?.icon ?? Wallet;
  const color = ACCOUNT_META[account.type]?.color ?? "text-primary";
  const gradient = ACCOUNT_META[account.type]?.gradient ?? "from-primary/20 via-primary/5 to-transparent";
  const isNegative = Number(account.balance) < 0;

  return (
    <Card
      className={cn(
        "card-hover animate-slide-up relative overflow-hidden border-0 shadow-sm",
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br",
          gradient,
        )}
      />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className={cn("rounded-lg p-2", `${color.replace("text-", "bg-")}/10`)}>
            <Icon className={cn("h-5 w-5", color)} />
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
        <CardTitle className="mt-1 text-base">{account.name}</CardTitle>
        <CardDescription>{accountTypeLabel(account.type)}</CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <p
          className={cn(
            "text-2xl font-bold tracking-tight",
            isNegative && "text-expense",
          )}
        >
          {isNegative ? "-" : ""}
          {formatCurrency(Math.abs(Number(account.balance)), account.currency)}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Возвращает человекочитаемую подпись типа счёта.
 *
 * @param type - Тип счёта (AccountType).
 * @returns Локализованная подпись, либо сам тип.
 */
function accountTypeLabel(type: AccountType): string {
  const labels: Record<AccountType, string> = {
    CASH: "Cash",
    DEBIT_CARD: "Debit Card",
    CREDIT_CARD: "Credit Card",
    SAVINGS: "Savings",
    ELECTRONIC: "Electronic",
  };
  return labels[type] ?? type;
}

/**
 * Список счетов пользователя.
 *
 * Загружает счета через AccountsStore на монтировании.
 *
 * Состояния рендеринга:
 * - Загрузка: сетка карточек-скелетонов.
 * - Ошибка: баннер с сообщением и кнопкой повтора.
 * - Пусто: карточка-заглушка с призывом создать первый счёт.
 * - Данные: сетка карточек счетов.
 *
 * @returns JSX-разметка списка счетов.
 */
export function AccountList() {
  const { accounts, isLoading, error, fetchAll, clearError } =
    useAccountsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Loading
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <AccountCardSkeleton key={i} index={i} />
        ))}
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-10">
          <p className="text-sm text-muted-foreground text-center">
            {error}
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearError();
              fetchAll();
            }}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty
  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No accounts yet</CardTitle>
          <CardDescription>
            Create your first account to start tracking finances.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Once created, your accounts will appear here with their balances.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Data
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {accounts.map((account, i) => (
        <AccountCard key={account.id} account={account} index={i} />
      ))}
    </div>
  );
}