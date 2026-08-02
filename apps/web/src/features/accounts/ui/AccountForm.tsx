"use client";

import { useState, useCallback } from "react";
import { createAccountSchema } from "@budget-calc/shared";
import { ACCOUNT_TYPES } from "@budget-calc/shared";
import { useAccountsStore } from "@/entities/accounts";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

interface AccountFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Человекочитаемая подпись типа счёта.
 */
const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  CASH: "Cash",
  DEBIT_CARD: "Debit Card",
  CREDIT_CARD: "Credit Card",
  SAVINGS: "Savings",
  ELECTRONIC: "Electronic",
};

/**
 * Форма создания нового счёта.
 *
 * Валидирует поля с помощью Zod (createAccountSchema), вызывает
 * POST /api/accounts через AccountsStore и при успехе вызывает onSuccess.
 *
 * Состояния рендеринга:
 * - Ввод данных: поля названия, типа и начального баланса.
 * - Ошибка валидации: подсветка поля + banner с первым сообщением.
 * - Отправка: спиннер на кнопке.
 *
 * @param props.onSuccess - Колбэк после успешного создания счёта.
 * @param props.onCancel - Колбэк при отмене.
 * @returns JSX-разметка формы создания счёта.
 */
export function AccountForm({ onSuccess, onCancel }: AccountFormProps) {
  const { create, isCreating, error, clearError } = useAccountsStore();

  const [name, setName] = useState("");
  const [type, setType] = useState<string>(ACCOUNT_TYPES[0]);
  const [balance, setBalance] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldErrors({});
      clearError();

      const payload = {
        name,
        type: type as (typeof ACCOUNT_TYPES)[number],
        balance: balance === "" ? undefined : parseFloat(balance),
      };

      // Validate with Zod
      const result = createAccountSchema.safeParse(payload);
      if (!result.success) {
        const flat = result.error.flatten().fieldErrors;
        const errors: Record<string, string> = {};
        if (flat.name) errors.name = flat.name[0];
        if (flat.type) errors.type = flat.type[0];
        if (flat.balance) errors.balance = flat.balance[0];
        setFieldErrors(errors);
        return;
      }

      try {
        await create(result.data);
        onSuccess?.();
      } catch {
        // Error set by store
      }
    },
    [name, type, balance, create, clearError, onSuccess],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Account</CardTitle>
        <CardDescription>
          Create a new bank account, card, or wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Error banner */}
          {(error || Object.keys(fieldErrors).length > 0) && (
            <div
              className="animate-fade-in rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
              role="alert"
            >
              {error ||
                fieldErrors.name ||
                fieldErrors.type ||
                fieldErrors.balance}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="name"
              className="text-xs font-medium text-foreground/70"
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (fieldErrors.name) {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.name;
                    return n;
                  });
                }
              }}
              placeholder="e.g. Main Checking"
              className={fieldErrors.name ? "border-warning" : ""}
              disabled={isCreating}
              autoFocus
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <Label
              htmlFor="type"
              className="text-xs font-medium text-foreground/70"
            >
              Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as (typeof ACCOUNT_TYPES)[number])}
              disabled={isCreating}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                fieldErrors.type ? "border-warning" : "border-input"
              }`}
            >
              {ACCOUNT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {ACCOUNT_TYPE_LABELS[t] ?? t}
                </option>
              ))}
            </select>
          </div>

          {/* Balance */}
          <div className="space-y-1.5">
            <Label
              htmlFor="balance"
              className="text-xs font-medium text-foreground/70"
            >
              Initial Balance
            </Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              min="0"
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
                if (fieldErrors.balance) {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.balance;
                    return n;
                  });
                }
              }}
              placeholder="0.00"
              className={fieldErrors.balance ? "border-warning" : ""}
              disabled={isCreating}
            />
            <p className="text-xs text-muted-foreground">
              Optional — defaults to 0
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating} className="flex-1">
              {isCreating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}