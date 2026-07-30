"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@budget-calc/shared";
import { publicClient } from "@/shared/api/api-client";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/ui/card";

/**
 * Форма сброса пароля.
 *
 * Читает токен из URL-параметра (?token=). Отображает три
 * состояния в зависимости от наличия токена и статуса отправки.
 *
 * Состояния рендеринга:
 * - Отсутствует токен: карточка "Invalid Link" с предложением запросить новый.
 * - Успешный сброс: карточка "Password Reset" с кнопкой входа.
 * - Ввод данных: форма с полями нового пароля и подтверждения.
 * - Загрузка: кнопка "Resetting..." отключена.
 * - Ошибка API: баннер с сообщением.
 *
 * @returns JSX-разметка формы сброса пароля.
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setApiError("");

    const result = resetPasswordSchema.safeParse({
      token,
      password,
      confirmPassword,
    });
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      if (flat.password) errors.password = flat.password[0];
      if (flat.confirmPassword) errors.confirmPassword = flat.confirmPassword[0];
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await publicClient().post("/api/auth/reset-password", {
        token,
        password,
      });
      setSuccess(true);
    } catch (err: any) {
      setApiError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Invalid Link</CardTitle>
          <CardDescription>
            This reset link is missing the token. Please request a new one.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Link
            href="/forgot-password"
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Request new reset link
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="w-full max-w-md border-0 shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Password Reset</CardTitle>
          <CardDescription>
            Your password has been updated successfully.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button onClick={() => router.push("/login")}>Sign In</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-0 shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set New Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {apiError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {apiError}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {fieldErrors.password && (
              <p className="text-sm text-destructive">{fieldErrors.password}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {fieldErrors.confirmPassword && (
              <p className="text-sm text-destructive">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
          <Link
            href="/login"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to sign in
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
