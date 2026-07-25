"use client";

import { ArrowRightLeft, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { TransactionList } from "@/features/transactions/ui/TransactionList";

export default function TransactionsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <ArrowRightLeft className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          </div>
          <p className="mt-1 text-muted-foreground">
            Track and manage all your income and expenses
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>

      {/* ── Transaction List ── */}
      <TransactionList />
    </div>
  );
}
