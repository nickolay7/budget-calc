"use client";

import Link from "next/link";
import { formatCurrency } from "@budget-calc/shared";
import { cn } from "@/shared/lib/cn";
import { Skeleton } from "@/shared/ui/skeleton";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  ArrowRightLeft,
  ArrowRight,
  Receipt,
  Plus,
  RefreshCw,
} from "lucide-react";
import type { TransactionWithRelations } from "../lib/useDashboard";

interface RecentTransactionsProps {
  transactions: TransactionWithRelations[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

function SkeletonRow() {
  return (
    <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function RecentTransactions({
  transactions,
  isLoading = false,
  isError = false,
  onRetry,
}: RecentTransactionsProps) {
  return (
    <Card className="animate-slide-up border-0 shadow-sm lg:col-span-2" style={{ animationDelay: "200ms" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Recent Activity
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
          <Link href="/transactions">
            View all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <RefreshCw className="mb-3 h-12 w-12 text-destructive/40" />
            <p className="text-sm font-medium text-destructive">
              Failed to load transactions
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Something went wrong. Please try again.
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 gap-1"
                onClick={onRetry}
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            )}
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Receipt className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <p className="text-sm font-medium text-muted-foreground">
              No transactions yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              Add your first transaction to get started
            </p>
            <Button size="sm" className="mt-4 gap-1" asChild>
              <Link href="/transactions/new">
                <Plus className="h-4 w-4" />
                New Transaction
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg px-3 py-3 transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      tx.type === "INCOME"
                        ? "bg-income/10 text-income"
                        : tx.type === "TRANSFER"
                          ? "bg-brand/10 text-brand"
                          : "bg-expense/10 text-expense",
                    )}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {tx.description ?? "Untitled"}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {tx.category?.name ?? tx.type} &middot;{" "}
                      {new Date(tx.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold tabular-nums",
                    tx.type === "INCOME"
                      ? "text-income"
                      : tx.type === "TRANSFER"
                        ? "text-brand"
                        : "text-expense",
                  )}
                >
                  {tx.type === "INCOME" ? "+" : "-"}
                  {formatCurrency(Math.abs(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
