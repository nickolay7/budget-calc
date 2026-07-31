/**
 * Страница деталей транзакции (`/transactions/[id]`).
 * Загружает данные транзакции по ID и отображает состояние
 * загрузки, ошибки, "не найдено" или полную информацию
 * в компоненте `TransactionDetail`.
 */
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTransactionsStore } from "@/entities/transactions";
import { TransactionDetail } from "@/features/transactions/ui/TransactionDetail";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

/**
 * Страница с детальной информацией о транзакции.
 * Обрабатывает четыре состояния: загрузка, ошибка, не найдено, данные.
 *
 * @returns JSX-разметка с деталями транзакции или соответствующим fallback.
 */
export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { currentTransaction, isLoading, error, fetchOne } =
    useTransactionsStore();

  useEffect(() => {
    if (id) {
      fetchOne(id);
    }
  }, [id, fetchOne]);

  return (
    <div className="animate-fade-in space-y-6">
      {/* ── Loading state ── */}
      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      )}

      {/* ── Error state ── */}
      {!isLoading && error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => fetchOne(id)}
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Not found state ── */}
      {!isLoading && !error && !currentTransaction && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Transaction not found.
            </p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/transactions">Back to Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Transaction detail ── */}
      {!isLoading && !error && currentTransaction && (
        <TransactionDetail transaction={currentTransaction} />
      )}
    </div>
  );
}
