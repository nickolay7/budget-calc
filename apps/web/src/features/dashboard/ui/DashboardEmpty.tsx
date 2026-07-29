"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { LayoutDashboard, PlusCircle, RefreshCw, Wallet } from "lucide-react";

interface DashboardEmptyProps {
  onRefresh?: () => void;
}

export function DashboardEmpty({ onRefresh }: DashboardEmptyProps) {
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
