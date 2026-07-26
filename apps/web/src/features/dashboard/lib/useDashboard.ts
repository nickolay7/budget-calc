"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  TransactionStats,
  BudgetProgressItem,
  Transaction,
  Account,
  PaginatedResponse,
} from "@budget-calc/shared";
import { apiClient } from "@/shared/api/api-client";

export type TransactionWithRelations = Transaction & {
  category?: { id: string; name: string; icon?: string; color?: string } | null;
  account?: { id: string; name: string } | null;
};

function getMonthRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

function getPrevMonthRange(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const prev = new Date(year, month - 1, 1);
  return getMonthRange(prev);
}

export interface UseDashboardReturn {
  stats: TransactionStats | null;
  budgetProgress: BudgetProgressItem[];
  recentTransactions: TransactionWithRelations[];
  totalBalance: number;
  incomeChange: number | null;
  expenseChange: number | null;
  savingsRate: number;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isEmpty: boolean;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [prevStats, setPrevStats] = useState<TransactionStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<
    TransactionWithRelations[]
  >([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [budgetProgress, setBudgetProgress] = useState<BudgetProgressItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    const now = new Date();
    const curr = getMonthRange(now);
    const prev = getPrevMonthRange(now);

    const results = await Promise.allSettled([
      apiClient().get<TransactionStats>(
        `/api/transactions/stats?startDate=${curr.start}&endDate=${curr.end}`,
      ),
      apiClient().get<TransactionStats>(
        `/api/transactions/stats?startDate=${prev.start}&endDate=${prev.end}`,
      ),
      apiClient().get<PaginatedResponse<TransactionWithRelations>>(
        "/api/transactions?limit=5",
      ),
      apiClient().get<Account[]>("/api/accounts"),
      apiClient().get<BudgetProgressItem[]>("/api/budgets/progress"),
    ]);

    if (!mounted.current) return;

    // Check for errors
    const errors = results.filter((r) => r.status === "rejected");
    if (errors.length > 0) {
      const reasons = errors
        .map((r) => (r as PromiseRejectedResult).reason?.message ?? "Unknown error")
        .join("; ");
      setError(reasons);
      setIsError(true);
    }

    // Extract fulfilled results
    const [
      statsResult,
      prevStatsResult,
      transactionsResult,
      accountsResult,
      budgetResult,
    ] = results;

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value);
    } else {
      setStats(null);
    }

    if (prevStatsResult.status === "fulfilled") {
      setPrevStats(prevStatsResult.value);
    } else {
      setPrevStats(null);
    }

    if (transactionsResult.status === "fulfilled") {
      setRecentTransactions(transactionsResult.value.data);
    } else {
      setRecentTransactions([]);
    }

    if (accountsResult.status === "fulfilled") {
      const balance = accountsResult.value.reduce(
        (sum, acct) => sum + Number(acct.balance),
        0,
      );
      setTotalBalance(balance);
    } else {
      setTotalBalance(0);
    }

    if (budgetResult.status === "fulfilled") {
      setBudgetProgress(budgetResult.value);
    } else {
      setBudgetProgress([]);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // Computed values
  const incomeChange =
    stats && prevStats && prevStats.totalIncome > 0
      ? ((stats.totalIncome - prevStats.totalIncome) / prevStats.totalIncome) *
        100
      : null;

  const expenseChange =
    stats && prevStats && prevStats.totalExpense > 0
      ? ((stats.totalExpense - prevStats.totalExpense) /
          prevStats.totalExpense) *
        100
      : null;

  const savingsRate =
    stats && stats.totalIncome > 0
      ? Math.round(
          ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100,
        )
      : 0;

  const isEmpty = !isLoading && !isError && stats?.totalTransactions === 0 && totalBalance === 0;

  return {
    stats,
    budgetProgress,
    recentTransactions,
    totalBalance,
    incomeChange,
    expenseChange,
    savingsRate,
    isLoading,
    isError,
    error,
    isEmpty,
    refresh: fetchDashboard,
  };
}
