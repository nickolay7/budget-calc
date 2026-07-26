"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { useDashboard, StatCard, RecentTransactions } from "@/features/dashboard";
import { formatCurrency } from "@budget-calc/shared";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  PlusCircle,
  Receipt,
  Tags,
  RefreshCw,
  LayoutDashboard,
} from "lucide-react";

/* ── Sub-components ── */

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-slide-up space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-7 w-28" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="animate-slide-up lg:col-span-2" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <Skeleton className="h-5 w-28" />
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardError({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-destructive/10 p-3">
            <RefreshCw className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">Something went wrong</h3>
          <p className="mb-1 text-sm text-muted-foreground">
            We couldn&apos;t load your dashboard data.
          </p>
          {error && (
            <p className="mb-4 max-w-sm text-xs text-muted-foreground/60">
              {error}
            </p>
          )}
          <Button variant="outline" className="gap-2" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-lg">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-brand/10 p-4">
            <LayoutDashboard className="h-10 w-10 text-brand" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">Welcome to Budget Calc!</h3>
          <p className="mb-8 max-w-sm text-sm text-muted-foreground">
            Your dashboard will show your financial overview once you add some
            data. Start by creating your first transaction or account.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link href="/transactions/new">
                <PlusCircle className="mr-1.5 h-4 w-4" />
                New Transaction
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/accounts">
                <Wallet className="mr-1.5 h-4 w-4" />
                Add Account
              </Link>
            </Button>
            {onRefresh && (
              <Button variant="ghost" size="sm" onClick={onRefresh}>
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Refresh
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BudgetProgressSection({
  budgets,
}: {
  budgets: Array<{
    budgetId: string;
    budgetName: string;
    spent: number;
    budgetAmount: number;
    percentage: number;
    categoryColor: string | null;
  }>;
}) {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "150ms" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">Budget Progress</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs" asChild>
          <Link href="/budgets">
            View all
            <TrendingUp className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-3">
          {budgets.map((b) => {
            const overBudget = b.percentage > 100;
            const nearLimit = b.percentage >= 80 && b.percentage <= 100;
            const barColor = overBudget
              ? "bg-destructive"
              : nearLimit
                ? "bg-warning"
                : (b.categoryColor ?? "bg-primary");

            return (
              <div key={b.budgetId} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{b.budgetName}</span>
                  <span
                    className={cn(
                      "tabular-nums text-xs",
                      overBudget && "font-semibold text-destructive",
                    )}
                  >
                    {formatCurrency(b.spent)} / {formatCurrency(b.budgetAmount)}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full transition-all", barColor)}
                    style={{ width: `${Math.min(b.percentage, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Quick Actions config ── */

const quickActions = [
  {
    label: "New Transaction",
    href: "/transactions/new",
    icon: PlusCircle,
    color: "text-brand",
    bg: "bg-brand/10",
  },
  {
    label: "View Reports",
    href: "/transactions",
    icon: Receipt,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Manage Budgets",
    href: "/budgets",
    icon: Tags,
    color: "text-income",
    bg: "bg-income/10",
  },
];

function QuickActionsCard() {
  return (
    <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.label}
              variant="outline"
              className="h-auto w-full justify-start gap-3 px-4 py-3"
              asChild
            >
              <Link href={action.href}>
                <div className={cn("rounded-lg p-1.5", action.bg)}>
                  <Icon className={cn("h-4 w-4", action.color)} />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

/* ── Helpers ── */

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatChange(value: number | null): { text: string | null; positive: boolean } {
  if (value === null) return { text: null, positive: true };
  return {
    text: `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`,
    positive: value >= 0,
  };
}

/* ── Page ── */

export default function DashboardPage() {
  const { user } = useAuthStore();
  const {
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
    refresh,
  } = useDashboard();

  /* State-dependent rendering */

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardError error={error} onRetry={refresh} />;
  }

  if (isEmpty) {
    return <DashboardEmpty onRefresh={refresh} />;
  }

  /* Computed display values */

  const incomeDisplay = formatChange(incomeChange);
  // For expenses: invert the sign — increased spending is bad, decreased is good
  const expenseDisplay = formatChange(expenseChange);
  const rateDisplay = { text: null, positive: savingsRate >= 0 };

  // Top 3 budgets by spending percentage
  const topBudgets = [...budgetProgress]
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* ── Greeting ── */}
      <div className="animate-slide-up">
        <h2 className="text-2xl font-bold tracking-tight">
          {getGreeting()}
          {user?.name ? `, ${user.name.split(" ")[0]}` : ""} ✦
        </h2>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s your financial overview for{" "}
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={formatCurrency(totalBalance)}
          change={null}
          changePositive={true}
          icon={Wallet}
          iconColor="text-brand"
          iconBg="bg-brand/10"
          delay={0}
        />
        <StatCard
          label="Income"
          value={stats ? formatCurrency(stats.totalIncome) : "$0.00"}
          change={incomeDisplay.text}
          changePositive={incomeDisplay.positive}
          icon={TrendingUp}
          iconColor="text-income"
          iconBg="bg-income/10"
          delay={100}
        />
        <StatCard
          label="Expenses"
          value={stats ? formatCurrency(stats.totalExpense) : "$0.00"}
          change={expenseDisplay.text}
          changePositive={!expenseDisplay.positive}
          icon={TrendingDown}
          iconColor="text-expense"
          iconBg="bg-expense/10"
          delay={200}
        />
        <StatCard
          label="Savings Rate"
          value={`${savingsRate}%`}
          change={rateDisplay.text}
          changePositive={rateDisplay.positive}
          icon={PiggyBank}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          delay={300}
        />
      </div>

      {/* ── Budget Progress ── */}
      {topBudgets.length > 0 && <BudgetProgressSection budgets={topBudgets} />}

      {/* ── Recent Activity + Quick Actions ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentTransactions transactions={recentTransactions} onRetry={refresh} />
        <QuickActionsCard />
      </div>
    </div>
  );
}
