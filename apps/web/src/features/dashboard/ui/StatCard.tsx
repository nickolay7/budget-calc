"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/ui/card";

interface StatCardProps {
  label: string;
  value: string;
  change: string | null;
  changePositive: boolean;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  isLoading?: boolean;
  delay?: number;
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
    />
  );
}

export function StatCard({
  label,
  value,
  change,
  changePositive,
  icon: Icon,
  iconColor,
  iconBg,
  isLoading = false,
  delay = 0,
}: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="animate-slide-up" style={{ animationDelay: `${delay}ms` }}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mb-2 h-7 w-28" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="card-hover animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={cn("rounded-lg p-2", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <p
          className={cn(
            "mt-1 text-xs",
            change !== null
              ? changePositive
                ? "text-income"
                : "text-expense"
              : "text-muted-foreground",
          )}
        >
          {change !== null ? `${changePositive ? "+" : ""}${change} from last month` : "— from last month"}
        </p>
      </CardContent>
    </Card>
  );
}
