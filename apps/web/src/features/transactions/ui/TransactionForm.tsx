"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  createTransactionSchema,
  type Transaction,
  type CreateTransactionDto,
  type UpdateTransactionDto,
  type Account,
  type Category,
} from "@budget-calc/shared";
import { useTransactionsStore } from "@/entities/transactions";
import { apiClient } from "@/shared/api/api-client";
import { Loader2, ArrowLeft } from "lucide-react";
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

interface TransactionFormProps {
  mode: "create" | "edit";
  initialData?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TRANSACTION_TYPES = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
  { value: "TRANSFER", label: "Transfer" },
] as const;

/**
 * Форма создания / редактирования транзакции.
 *
 * Загружает списки счетов и категорий для выпадающих списков.
 *
 * Состояния рендеринга:
 * - Загрузка опций: спиннер на весь карточный блок.
 * - Нет счетов: карточка-заглушка с предложением создать счёт.
 * - Ввод данных: форма с полями типа, суммы, описания, даты,
 *   счёта, категории и опционально счёта назначения (для переводов).
 * - Ошибка API: баннер с сообщением.
 *
 * @param props.mode - Режим формы: "create" или "edit".
 * @param props.initialData - Данные транзакции для редактирования.
 * @param props.onSuccess - Колбэк после успешного сохранения.
 * @param props.onCancel - Колбэк при отмене.
 * @returns JSX-разметка формы транзакции.
 */
export function TransactionForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const router = useRouter();
  const { create, update, isLoading, error, clearError } =
    useTransactionsStore();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const [amount, setAmount] = useState(
    initialData ? String(initialData.amount) : "",
  );
  const [type, setType] = useState<"INCOME" | "EXPENSE" | "TRANSFER">(
    initialData?.type ?? "EXPENSE",
  );
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [date, setDate] = useState(() => {
    if (initialData?.date) {
      return initialData.date.slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  });
  const [categoryId, setCategoryId] = useState(
    initialData?.categoryId ?? "",
  );
  const [accountId, setAccountId] = useState(
    initialData?.accountId ?? "",
  );
  const [noAccounts, setNoAccounts] = useState(false);
  const [toAccountId, setToAccountId] = useState(
    initialData?.toAccountId ?? "",
  );
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string>
  >({});

  const isTransfer = type === "TRANSFER";
  const isEdit = mode === "edit";

  // Fetch accounts and categories for dropdowns
  useEffect(() => {
    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const [accountsData, categoriesData] = await Promise.all([
          apiClient().get<Account[]>("/api/accounts"),
          apiClient().get<Category[]>("/api/categories"),
        ]);
        setAccounts(accountsData as Account[]);
        setCategories(categoriesData as Category[]);
        // Set accountId inline to avoid race condition with useEffect
        if (accountsData.length > 0) {
          setAccountId(accountsData[0].id);
        } else if (!isEdit) {
          setNoAccounts(true);
        }
      } catch {
        // Silently fail — form is still usable
      } finally {
        setIsLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldErrors({});
      clearError();

      // Guard: no accounts available (create mode only)
      if (noAccounts && !isEdit) {
        setFieldErrors({ accountId: "You need to create an account first" });
        return;
      }

      const payload = {
        amount: parseFloat(amount),
        type,
        description: description || undefined,
        date,
        categoryId: categoryId || undefined,
        accountId,
        ...(isTransfer && toAccountId ? { toAccountId } : {}),
      };

      // Validate with Zod (use create schema which has all fields including toAccountId)
      const result = createTransactionSchema.safeParse(payload);
      if (!result.success) {
        const flat = result.error.flatten().fieldErrors;
        const errors: Record<string, string> = {};
        if (flat.amount) errors.amount = flat.amount[0];
        if (flat.type) errors.type = flat.type[0];
        if (flat.categoryId) errors.categoryId = flat.categoryId[0];
        if (flat.accountId) errors.accountId = flat.accountId[0];
        if (flat.toAccountId)
          errors.toAccountId = flat.toAccountId[0];
        setFieldErrors(errors);
        return;
      }

      try {
        if (isEdit && initialData) {
          const updatePayload: UpdateTransactionDto = {
            ...(payload.amount && { amount: payload.amount }),
            ...(payload.type && { type: payload.type }),
            ...(payload.description && {
              description: payload.description,
            }),
            ...(payload.date && { date: payload.date }),
            ...(payload.categoryId && {
              categoryId: payload.categoryId,
            }),
            ...(payload.accountId && {
              accountId: payload.accountId,
            }),
          };
          await update(initialData.id, updatePayload);
        } else {
          await create(payload as CreateTransactionDto);
        }
        onSuccess?.();
        if (!onSuccess) {
          router.push("/transactions");
        }
      } catch {
        // Error set by store
      }
    },
    [
      amount,
      type,
      description,
      date,
      categoryId,
      accountId,
      toAccountId,
      isTransfer,
      isEdit,
      initialData,
      create,
      update,
      clearError,
      onSuccess,
      router,
    ],
  );

  if (isLoadingOptions) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // No accounts — can't create transactions
  if (noAccounts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </CardTitle>
          <CardDescription>
            You need at least one account before adding transactions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Head to the Accounts page to create your first account, then come
            back to add transactions.
          </p>
          <Button asChild variant="default">
            <a href="/accounts">Go to Accounts</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Transaction" : "Add Transaction"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Update the details of this transaction"
            : "Record a new income or expense"}
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
                fieldErrors.amount ||
                fieldErrors.type ||
                fieldErrors.accountId}
            </div>
          )}

          {/* Type */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground/70">
              Type
            </Label>
            <div className="flex gap-2">
              {TRANSACTION_TYPES.map((t) => (
                <Button
                  key={t.value}
                  type="button"
                  variant={type === t.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setType(t.value)}
                  className="flex-1"
                >
                  {t.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label
              htmlFor="amount"
              className="text-xs font-medium text-foreground/70"
            >
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (fieldErrors.amount) {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.amount;
                    return n;
                  });
                }
              }}
              placeholder="0.00"
              className={fieldErrors.amount ? "border-warning" : ""}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="description"
              className="text-xs font-medium text-foreground/70"
            >
              Description
            </Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              disabled={isLoading}
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <Label
              htmlFor="date"
              className="text-xs font-medium text-foreground/70"
            >
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Account */}
          <div className="space-y-1.5">
            <Label
              htmlFor="accountId"
              className="text-xs font-medium text-foreground/70"
            >
              Account
            </Label>
            <select
              id="accountId"
              value={accountId}
              onChange={(e) => {
                setAccountId(e.target.value);
                if (fieldErrors.accountId) {
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.accountId;
                    return n;
                  });
                }
              }}
              disabled={isLoading}
              className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                fieldErrors.accountId ? "border-warning" : "border-input"
              }`}
            >
              {accounts.length === 0 && (
                <option value="">No accounts available</option>
              )}
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} (${Number(acc.balance).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label
              htmlFor="categoryId"
              className="text-xs font-medium text-foreground/70"
            >
              Category
            </Label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isLoading}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon ?? ""} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Account (only for transfers) */}
          {isTransfer && (
            <div className="space-y-1.5">
              <Label
                htmlFor="toAccountId"
                className="text-xs font-medium text-foreground/70"
              >
                Destination Account
              </Label>
              <select
                id="toAccountId"
                value={toAccountId}
                onChange={(e) => setToAccountId(e.target.value)}
                disabled={isLoading}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  fieldErrors.toAccountId
                    ? "border-warning"
                    : "border-input"
                }`}
              >
                <option value="">Select destination</option>
                {accounts
                  .filter((a) => a.id !== accountId)
                  .map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${Number(acc.balance).toFixed(2)})
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel ?? (() => router.back())}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Transaction"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
