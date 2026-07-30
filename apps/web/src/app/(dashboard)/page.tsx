/**
 * Главная страница панели управления (`/`).
 * Отображает приветствие, сетку статистики (баланс, доходы, расходы,
 * норма сбережений), прогресс по бюджетам, последние транзакции и
 * панель быстрых действий.
 */
"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { useDashboard } from "@/features/dashboard/lib/useDashboard";
import { formatChange } from "@/features/dashboard/lib/formatChange";
import { StatCard } from "@/features/dashboard/ui/StatCard";
import { RecentTransactions } from "@/features/dashboard/ui/RecentTransactions";
import { BudgetProgressSection } from "@/features/dashboard/ui/BudgetProgressSection";
import { DashboardSkeleton } from "@/features/dashboard/ui/DashboardSkeleton";
import { DashboardError } from "@/features/dashboard/ui/DashboardError";
import { DashboardEmpty } from "@/features/dashboard/ui/DashboardEmpty";
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
} from "lucide-react";

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

/**
 * Карточка с кнопками быстрых действий: создание транзакции,
 * просмотр отчётов и управление бюджетами.
 *
 * @returns JSX-разметка карточки быстрых действий.
 */
function QuickActionsCard() {
  return (
    <Card className="animate-slide-up border-0 shadow-sm" style={{ animationDelay: "300ms" }}>
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

/**
 * Определяет приветствие в зависимости от текущего часа.
 *
 * @returns Строку приветствия на английском: "Good morning", "Good afternoon"
 * или "Good evening".
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/* ── Page ── */

/**
 * Главная страница панели управления.
 * Рендерит приветствие с именем пользователя, сетку из четырёх
 * статистических карточек, таблицу последних транзакций и блок
 * быстрых действий.
 *
 * @returns JSX-разметка панели управления.
 */
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
    allFailed,
    statsError,
    transactionsError,
    budgetsError,
    isEmpty,
    refresh,
  } = useDashboard();

  /* State-dependent rendering */

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (allFailed) {
    return <DashboardError error={null} onRetry={refresh} />;
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
          isError={false}
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
          isError={statsError}
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
          isError={statsError}
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
          isError={statsError}
          delay={300}
        />
      </div>

      {/* ── Budget Progress ── */}
      {!budgetsError && topBudgets.length > 0 && (
        <BudgetProgressSection budgets={topBudgets} />
      )}

      {/* ── Recent Activity + Quick Actions ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        <RecentTransactions transactions={recentTransactions} isError={transactionsError} onRetry={refresh} />
        <QuickActionsCard />
      </div>
    </div>
  );
}
