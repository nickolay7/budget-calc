"use client";

import {
  PiggyBank,
  Plus,
  AlertTriangle,
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

const budgets = [
  {
    name: "Food & Dining",
    spent: 680,
    total: 800,
    color: "bg-orange-500",
    textColor: "text-orange-500",
  },
  {
    name: "Transportation",
    spent: 220,
    total: 300,
    color: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    name: "Entertainment",
    spent: 185,
    total: 200,
    color: "bg-purple-500",
    textColor: "text-purple-500",
  },
  {
    name: "Shopping",
    spent: 420,
    total: 400,
    color: "bg-pink-500",
    textColor: "text-pink-500",
  },
  {
    name: "Utilities",
    spent: 175,
    total: 250,
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  {
    name: "Healthcare",
    spent: 85,
    total: 200,
    color: "bg-emerald-500",
    textColor: "text-emerald-500",
  },
];

export default function BudgetsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <PiggyBank className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Set spending limits and track your progress
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          New Budget
        </Button>
      </div>

      {/* ── Summary bar ── */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/5 to-brand/5">
        <CardContent className="py-6">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Budget</p>
              <p className="text-2xl font-bold tracking-tight">$2,150.00</p>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-sm text-muted-foreground">Spent</p>
              <p className="text-2xl font-bold tracking-tight text-income">
                $1,765.00
              </p>
            </div>
            <div className="hidden h-10 w-px bg-border sm:block" />
            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-2xl font-bold tracking-tight text-brand">
                $385.00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Budget Progress Cards ── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {budgets.map((budget) => {
          const percentage = Math.round((budget.spent / budget.total) * 100);
          const isOverBudget = percentage > 100;
          const isWarning = percentage >= 80 && percentage <= 100;

          return (
            <Card
              key={budget.name}
              className="card-hover animate-slide-up overflow-hidden"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{budget.name}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </div>
                <CardDescription>
                  ${budget.spent.toLocaleString()} of $
                  {budget.total.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Progress bar */}
                <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isOverBudget
                        ? "bg-expense"
                        : isWarning
                          ? "bg-amber-500"
                          : budget.color,
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium">{percentage}%</span>
                    {isOverBudget && (
                      <span className="flex items-center gap-1 text-xs text-expense">
                        <AlertTriangle className="h-3 w-3" />
                        Over budget
                      </span>
                    )}
                    {isWarning && !isOverBudget && (
                      <span className="text-xs text-amber-500 dark:text-amber-400">
                        Nearly there
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isOverBudget
                        ? "text-expense"
                        : isWarning
                          ? "text-amber-500 dark:text-amber-400"
                          : "text-income",
                    )}
                  >
                    {isOverBudget
                      ? `-$${(budget.spent - budget.total).toLocaleString()}`
                      : `$${(budget.total - budget.spent).toLocaleString()} left`}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Empty state ── */}
      {budgets.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <PiggyBank className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-semibold">No budgets yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first budget to start tracking spending across
              different categories.
            </p>
            <Button className="mt-6 gap-1">
              <Plus className="h-4 w-4" />
              Create Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
