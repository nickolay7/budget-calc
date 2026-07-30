"use client";

import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { RefreshCw } from "lucide-react";

interface DashboardErrorProps {
  error: string | null;
  onRetry: () => void;
}

export function DashboardError({ error, onRetry }: DashboardErrorProps) {
  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md border-0 shadow-sm">
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
