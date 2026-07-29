/**
 * Страница создания новой транзакции (`/transactions/new`).
 * Рендерит форму `TransactionForm` в режиме создания и
 * перенаправляет на список транзакций при успешной отправке.
 */
"use client";

import { useRouter } from "next/navigation";
import { TransactionForm } from "@/features/transactions/ui/TransactionForm";

/**
 * Страница создания новой транзакции.
 *
 * @returns JSX-разметка с формой создания транзакции.
 */
export default function NewTransactionPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-in space-y-6">
      <TransactionForm
        mode="create"
        onSuccess={() => router.push("/transactions")}
        onCancel={() => router.back()}
      />
    </div>
  );
}
