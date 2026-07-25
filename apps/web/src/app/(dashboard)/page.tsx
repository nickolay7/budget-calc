"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowRightLeft,
  Tags,
  PlusCircle,
  ArrowRight,
  Receipt,
  Plus,
} from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

/* ── Mock data for visual showcase ── */

const stats = [
  {
    label: "Total Balance",
    value: "$12,480.00",
    change: "+5.2%",
    positive: true,
    icon: Wallet,
    color: "text-brand",
    bg: "bg-brand/10",
  },
  {
    label: "Income",
    value: "$4,250.00",
    change: "+2.1%",
    positive: true,
    icon: TrendingUp,
    color: "text-income",
    bg: "bg-income/10",
  },
  {
    label: "Expenses",
    value: "$2,830.00",
    change: "-3.4%",
    positive: false,
    icon: TrendingDown,
    color: "text-expense",
    bg: "bg-expense/10",
  },
  {
    label: "Savings Rate",
    value: "33.4%",
    change: "+1.2%",
    positive: true,
    icon: PiggyBank,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const recentTransactions = [
  {
    id: 1,
    description: "Grocery Store",
    amount: -85.32,
    category: "Food",
    date: "Today",
    color: "text-expense",
  },
  {
    id: 2,
    description: "Salary Deposit",
    amount: 3200.0,
    category: "Income",
    date: "Yesterday",
    color: "text-income",
  },
  {
    id: 3,
    description: "Electric Bill",
    amount: -142.5,
    category: "Utilities",
    date: "2 days ago",
    color: "text-expense",
  },
  {
    id: 4,
    description: "Freelance Payment",
    amount: 850.0,
    category: "Income",
    date: "3 days ago",
    color: "text-income",
  },
  {
    id: 5,
    description: "Coffee Shop",
    amount: -5.75,
    category: "Food",
    date: "3 days ago",
    color: "text-expense",
  },
];

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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Math.abs(amount));
}

export default function DashboardPage() {
  const { user } = useAuthStore();

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
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="card-hover animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={cn("rounded-lg p-2", stat.bg)}>
                  <Icon className={cn("h-4 w-4", stat.color)} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tracking-tight">
                  {stat.value}
                </div>
                <p
                  className={cn(
                    "mt-1 text-xs",
                    stat.positive ? "text-income" : "text-expense",
                  )}
                >
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Recent Activity + Quick Actions ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <Card className="animate-slide-up lg:col-span-2" style={{ animationDelay: "200ms" }}>
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
            {recentTransactions.length > 0 ? (
              <div className="space-y-1">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          tx.amount > 0
                            ? "bg-income/10 text-income"
                            : "bg-expense/10 text-expense",
                        )}
                      >
                        <ArrowRightLeft className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.category} &middot; {tx.date}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        tx.color,
                      )}
                    >
                      {tx.amount > 0 ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Quick Actions
            </CardTitle>
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
      </div>
    </div>
  );
}
