"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserSchema } from "@budget-calc/shared";
import { useAuthStore } from "@/entities/auth";
import { Mail, Lock, User, Loader2 } from "lucide-react";
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

/**
 * Форма регистрации нового пользователя.
 *
 * Содержит поля name, email, password, confirmPassword.
 * Валидация через createUserSchema, проверка совпадения паролей,
 * анимация встряски при ошибках.
 *
 * Состояния рендеринга:
 * - Ввод данных: форма с четырьмя полями.
 * - Загрузка: spinner на кнопке, поля отключены.
 * - Ошибка валидации: подсветка полей, баннер с сообщением, анимация shake.
 * - Ошибка API: баннер с сообщением от сервера.
 *
 * @returns JSX-разметка формы регистрации.
 */
export function RegisterForm() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [shakeCount, setShakeCount] = useState(0);

  const triggerShake = useCallback(() => {
    if (shakeCount < 3) {
      setShakeCount((c) => c + 1);
      setTimeout(() => setShakeCount(0), 500);
    }
  }, [shakeCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    clearError();

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: "Passwords do not match" });
      triggerShake();
      return;
    }

    const result = createUserSchema.safeParse({ email, name, password });
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      if (flat.name) errors.name = flat.name[0];
      if (flat.email) errors.email = flat.email[0];
      if (flat.password) errors.password = flat.password[0];
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    try {
      await register(email, name, password);
      router.push("/");
    } catch {
      triggerShake();
    }
  };

  const hasError = (field: string) => !!fieldErrors[field];

  return (
    <Card className="auth-glass w-full border-0 shadow-2xl">
      <CardHeader className="items-center pb-2 pt-8 text-center">
        {/* Icon */}
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-brand shadow-md">
          <svg
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        </div>
        <CardTitle className="text-xl">Create Account</CardTitle>
        <CardDescription>Start tracking your expenses</CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Error banner */}
          {(error || Object.values(fieldErrors).length > 0) && (
            <div
              className="animate-fade-in rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M12 3l9.66 16.5H2.34L12 3z"
                  />
                </svg>
                <span>
                  {error ||
                    fieldErrors.name ||
                    fieldErrors.email ||
                    fieldErrors.password ||
                    fieldErrors.confirmPassword}
                </span>
              </div>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground/70">
              Name
            </Label>
            <div
              className={`auth-input-wrapper flex items-center rounded-xl border bg-background/60 transition-all duration-200 ${
                hasError("name")
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasError("name") ? "shake" : ""}`}
            >
              <User className="auth-input-icon ml-4 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors duration-200" />
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name)
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.name;
                      return n;
                    });
                }}
                placeholder="John Doe"
                className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="name"
                disabled={isLoading}
                autoFocus
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground/70">
              Email
            </Label>
            <div
              className={`auth-input-wrapper flex items-center rounded-xl border bg-background/60 transition-all duration-200 ${
                hasError("email")
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasError("email") ? "shake" : ""}`}
            >
              <Mail className="auth-input-icon ml-4 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors duration-200" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.email;
                      return n;
                    });
                }}
                placeholder="alex@example.com"
                className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-foreground/70">
              Password
            </Label>
            <div
              className={`auth-input-wrapper flex items-center rounded-xl border bg-background/60 transition-all duration-200 ${
                hasError("password")
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasError("password") ? "shake" : ""}`}
            >
              <Lock className="auth-input-icon ml-4 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors duration-200" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.password;
                      return n;
                    });
                }}
                placeholder="At least 6 characters"
                className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-foreground/70">
              Confirm Password
            </Label>
            <div
              className={`auth-input-wrapper flex items-center rounded-xl border bg-background/60 transition-all duration-200 ${
                hasError("confirmPassword")
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasError("confirmPassword") ? "shake" : ""}`}
            >
              <Lock className="auth-input-icon ml-4 h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors duration-200" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword)
                    setFieldErrors((p) => {
                      const n = { ...p };
                      delete n.confirmPassword;
                      return n;
                    });
                }}
                placeholder="Repeat your password"
                className="h-11 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="new-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            className="btn-gradient mt-2 h-11 w-full text-sm font-semibold [&_svg]:size-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Login link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
