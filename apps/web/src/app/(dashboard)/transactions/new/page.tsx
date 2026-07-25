"use client";

import { useRouter } from "next/navigation";
import { TransactionForm } from "@/features/transactions/ui/TransactionForm";

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
