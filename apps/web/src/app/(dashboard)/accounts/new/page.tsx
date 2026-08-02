/**
 * Страница создания нового счёта (`/accounts/new`).
 * Рендерит форму `AccountForm` и перенаправляет на список
 * счетов при успешном создании.
 */
"use client";

import { useRouter } from "next/navigation";
import { AccountForm } from "@/features/accounts/ui/AccountForm";

/**
 * Страница создания нового счёта.
 *
 * @returns JSX-разметка с формой создания счёта.
 */
export default function NewAccountPage() {
  const router = useRouter();

  return (
    <div className="animate-fade-in space-y-6">
      <AccountForm
        onSuccess={() => router.push("/accounts")}
        onCancel={() => router.back()}
      />
    </div>
  );
}