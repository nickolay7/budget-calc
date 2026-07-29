"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Transaction } from "@budget-calc/shared";
import { useTransactionsStore } from "@/entities/transactions";
import {
  ArrowRightLeft,
  Pencil,
  Trash2,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { TransactionForm } from "./TransactionForm";

interface TransactionDetailProps {
  transaction: Transaction;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

const TYPE_STYLES: Record<
  string,
  { label: string; bg: string; text: string }
> = {
  INCOME: {
    label: "Income",
    bg: "bg-income/10",
    text: "text-income",
  },
  EXPENSE: {
    label: "Expense",
    bg: "bg-expense/10",
    text: "text-expense",
  },
  TRANSFER: {
    label: "Transfer",
    bg: "bg-primary/10",
    text: "text-primary",
  },
};

/**
 * Компонент детального просмотра транзакции.
 *
 * Отображает полную информацию о транзакции: сумму, тип, дату,
 * счёт, категорию. Поддерживает режим редактирования (переключается
 * на TransactionForm) и удаление с подтверждением.
 *
 * @param props.transaction - Объект транзакции для отображения.
 * @returns JSX-разметка детального просмотра транзакции.
 */
export function TransactionDetail({
  transaction,
}: TransactionDetailProps) {
  const router = useRouter();
  const { remove, isLoading } = useTransactionsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const style = TYPE_STYLES[transaction.type] ?? TYPE_STYLES.EXPENSE;
  const isNegative =
    transaction.type === "EXPENSE" || transaction.type === "TRANSFER";
  const sign = transaction.type === "INCOME" ? "+" : "-";

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      await remove(transaction.id);
      router.push("/transactions");
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [transaction.id, remove, router]);

  const txWithRelations = transaction as Transaction & {
    category?: { id: string; name: string; icon?: string; color?: string };
    account?: { id: string; name: string };
    toAccount?: { id: string; name: string };
  };

  if (isEditing) {
    return (
      <TransactionForm
        mode="edit"
        initialData={transaction}
        onSuccess={() => {
          setIsEditing(false);
          // Refetch — component will get updated data from parent
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
            <ArrowRightLeft className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Transaction Details
          </h1>
        </div>
      </div>

      {/* Detail card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">
                  {sign}
                  {formatCurrency(Number(transaction.amount))}
                </CardTitle>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
                >
                  {style.label}
                </span>
              </div>
              {transaction.description && (
                <CardDescription className="mt-1 text-base">
                  {transaction.description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              {!showDeleteConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-destructive hover:bg-destructive/10"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Confirm
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Date */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Date
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {formatDate(transaction.date)}
              </p>
            </div>

            {/* Type */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Type
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {style.label}
              </p>
            </div>

            {/* Account */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Account
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {txWithRelations.account?.name ?? transaction.accountId}
              </p>
            </div>

            {/* Destination (for transfers) */}
            {transaction.type === "TRANSFER" && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Destination Account
                </p>
                <p className="mt-0.5 text-sm font-medium">
                  {txWithRelations.toAccount?.name ??
                    txWithRelations.toAccountId ??
                    "N/A"}
                </p>
              </div>
            )}

            {/* Category */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Category
              </p>
              <p className="mt-0.5 text-sm font-medium">
                {txWithRelations.category?.name ??
                  (transaction.categoryId ? "Unknown" : "Uncategorized")}
              </p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Amount
              </p>
              <p
                className={`mt-0.5 text-sm font-semibold ${
                  transaction.type === "INCOME"
                    ? "text-income"
                    : transaction.type === "EXPENSE"
                      ? "text-expense"
                      : "text-foreground"
                }`}
              >
                {sign}
                {formatCurrency(Number(transaction.amount))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
