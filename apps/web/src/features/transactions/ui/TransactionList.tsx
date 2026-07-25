"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import type { Transaction, TransactionQueryParams } from "@budget-calc/shared";

type TransactionWithRelations = Transaction & {
  category?: { id: string; name: string; icon?: string; color?: string } | null;
  account?: { id: string; name: string } | null;
  toAccount?: { id: string; name: string } | null;
};
import { useTransactionsStore } from "@/entities/transactions";
import { ArrowRightLeft, Search, Plus, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

const TYPE_STYLES: Record<string, { label: string; bg: string; text: string }> = {
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateStr));
}

function TransactionSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse items-center gap-4 rounded-lg border p-4"
        >
          <div className="h-8 w-8 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

export function TransactionList() {
  const {
    transactions,
    meta,
    isLoading,
    error,
    fetchAll,
    clearError,
  } = useTransactionsStore();

  // Filter state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const buildParams = useCallback((): TransactionQueryParams => {
    const params: TransactionQueryParams = {};
    if (typeFilter) params.type = typeFilter as any;
    if (categoryFilter) params.categoryId = categoryFilter;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    params.page = page;
    params.limit = limit;
    return params;
  }, [typeFilter, categoryFilter, startDate, endDate, page]);

  useEffect(() => {
    fetchAll(buildParams());
  }, [fetchAll, buildParams]);

  const handleSearch = useCallback(() => {
    setPage(1);
    fetchAll(buildParams());
  }, [fetchAll, buildParams]);

  const totalPages = meta?.totalPages ?? 1;

  // Get unique categories from transactions for filter dropdown
  const txWithRelations = transactions as TransactionWithRelations[];
  const uniqueCategories = [
    ...new Map(
      txWithRelations
        .filter((t) => t.category)
        .map((t) => [t.category!.id, t.category!]),
    ).values(),
  ];

  return (
    <div className="space-y-6">
      {/* ── Filters ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">All types</option>
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="TRANSFER">Transfer</option>
                </select>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setPage(1);
                  }}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Start date"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setPage(1);
                  }}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="End date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Error state ── */}
      {error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 gap-1"
              onClick={() => {
                clearError();
                fetchAll(buildParams());
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Loading state ── */}
      {isLoading && !error && <TransactionSkeleton />}

      {/* ── Empty state ── */}
      {!isLoading && !error && transactions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <ArrowRightLeft className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold">No transactions yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {page > 1
                ? "No transactions found on this page."
                : "Get started by adding your first transaction. Track every expense and income to stay on top of your finances."}
            </p>
            {page === 1 && (
              <Button className="mt-6 gap-1" asChild>
                <Link href="/transactions/new">
                  <Plus className="h-4 w-4" />
                  Add Transaction
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Transaction list ── */}
      {!isLoading && !error && transactions.length > 0 && (
        <>
          <div className="space-y-2">
            {txWithRelations.map((tx) => {
              const t = tx;
              const style = TYPE_STYLES[t.type] ?? TYPE_STYLES.EXPENSE;
              const isNegative =
                t.type === "EXPENSE" || t.type === "TRANSFER";
              const sign = t.type === "INCOME" ? "+" : "-";

              return (
                <Link
                  key={t.id}
                  href={`/transactions/${t.id}`}
                  className="card-hover group flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-200 hover:bg-accent/50"
                >
                  {/* Type icon */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${style.bg}`}
                  >
                    <ArrowRightLeft className={`h-4 w-4 ${style.text}`} />
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {t.description || "No description"}
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${style.bg} ${style.text}`}
                      >
                        {style.label}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(t.date)}</span>
                      {t.category?.name && (
                        <>
                          <span>·</span>
                          <span>{t.category.name}</span>
                        </>
                      )}
                      <span>·</span>
                      <span>{t.account?.name ?? "Unknown"}</span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold tabular-nums ${
                        t.type === "INCOME"
                          ? "text-income"
                          : t.type === "EXPENSE"
                            ? "text-expense"
                            : "text-foreground"
                      }`}
                    >
                      {sign}
                      {formatCurrency(Number(t.amount))}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
                {meta && ` (${meta.total} total)`}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
