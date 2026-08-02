"use client";

import { useState, useCallback } from "react";
import { createCategorySchema, type Category } from "@budget-calc/shared";
import { apiClient } from "@/shared/api/api-client";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

interface CategoryCreateInlineProps {
  /** Колбэк, вызываемый после успешного создания категории. */
  onCreated: (category: Category) => void;
  /** Колбэк отмены (закрытия) инлайн-формы. */
  onCancel?: () => void;
}

/**
 * Компактная инлайн-форма быстрого создания категории.
 * Используется в форме транзакции, чтобы можно было создать
 * категорию «на лету» и сразу выбрать её.
 *
 * Состояния рендеринга:
 * - Ввод данных: поля названия и цвета.
 * - Ошибка валидации: banner со первым сообщением.
 * - Отправка: спиннер на кнопке.
 *
 * @param props.onCreated - Колбэк с созданной категорией.
 * @param props.onCancel - Колбэк при отмене.
 * @returns JSX-разметка инлайн-формы категории.
 */
export function CategoryCreateInline({
  onCreated,
  onCancel,
}: CategoryCreateInlineProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6b7280");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setError(null);

      const result = createCategorySchema.safeParse({ name, color });
      if (!result.success) {
        const msg =
          result.error.flatten().fieldErrors.name?.[0] ??
          result.error.flatten().fieldErrors.color?.[0] ??
          "Invalid category";
        setError(msg);
        return;
      }

      setIsCreating(true);
      try {
        const created = await apiClient().post<Category>(
          "/api/categories",
          result.data,
        );
        onCreated(created);
      } catch (err: any) {
        setError(
          err.message ?? err.response?.message ?? "Failed to create category",
        );
      } finally {
        setIsCreating(false);
      }
    },
    [name, color, onCreated],
  );

  return (
    <div className="mt-2 space-y-3 rounded-xl border border-input bg-muted/40 p-3">
      {error && (
        <div
          className="animate-fade-in rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-xs text-warning"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-1">
        <Label
          htmlFor="new-category-name"
          className="text-xs font-medium text-foreground/70"
        >
          Category name
        </Label>
        <Input
          id="new-category-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Groceries"
          className="h-9"
          disabled={isCreating}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
      </div>

      {/* Color */}
      <div className="flex items-end gap-3">
        <div className="space-y-1">
          <Label
            htmlFor="new-category-color"
            className="text-xs font-medium text-foreground/70"
          >
            Color
          </Label>
          <Input
            id="new-category-color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-14 cursor-pointer p-1"
            disabled={isCreating}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-1 justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isCreating}
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit()}
            disabled={isCreating}
            className="flex items-center gap-1.5"
          >
            {isCreating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="h-3.5 w-3.5" />
            )}
            {isCreating ? "Creating..." : "Create Category"}
          </Button>
        </div>
      </div>
    </div>
  );
}