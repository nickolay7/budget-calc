"use client";

import Link from "next/link";
import { formatCurrency } from "@budget-calc/shared";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { TrendingUp } from "lucide-react";

interface BudgetProgressItem {
  budgetId: string;
  budgetName: string;
  spent: number;
  budgetAmount: number;
  percentage: number;
  categoryColor: string | null;
}

interface BudgetProgressSectionProps {
  budgets: BudgetProgressItem[];
}

export function BudgetProgressSection({
  budgets,
}: BudgetProgressSectionProps) {
  if (budgets.length === 0) return null;

  return (
    <Card className="animate-slide-up border-0 shadow-sm" style={{ animationDelay: "150ms" }}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Budget Progress
        </CardTitle>
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
