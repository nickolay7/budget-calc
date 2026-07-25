"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginSchema } from "@budget-calc/shared";
import { useAuthStore } from "@/entities/auth";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
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

    if (!agreed) {
      setFieldErrors({ agreed: "You must agree to the Terms of Service and Privacy Policy" });
      triggerShake();
      return;
    }

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const flat = result.error.flatten().fieldErrors;
      const errors: Record<string, string> = {};
      if (flat.email) errors.email = flat.email[0];
      if (flat.password) errors.password = flat.password[0];
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    try {
      await login(email, password);
      router.push("/");
    } catch {
      triggerShake();
    }
  };

  const hasEmailError = !!fieldErrors.email;
  const hasPasswordError = !!fieldErrors.password;

  return (
    <Card className="auth-glass w-full max-w-sm border-0 shadow-2xl">
      <CardHeader className="items-center pb-2 pt-10 text-center">
        {/* Icon */}
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand shadow-md">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </div>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-10">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
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
                  {error || fieldErrors.agreed || fieldErrors.email || fieldErrors.password}
                </span>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground/70">
              Email
            </Label>
            <div
              className={`auth-input-wrapper flex items-center rounded-xl border bg-background/60 transition-all duration-200 ${
                hasEmailError
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasEmailError ? "shake" : ""}`}
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
                className="h-12 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="email"
                disabled={isLoading}
                autoFocus
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
                hasPasswordError
                  ? "border-warning/60 has-error"
                  : "border-border focus-within:border-primary/40"
              } ${shakeCount > 0 && hasPasswordError ? "shake" : ""}`}
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
                placeholder="••••••••"
                className="h-12 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agreed"
              checked={agreed}
              onCheckedChange={(checked) => {
                setAgreed(checked === true);
                if (fieldErrors.agreed)
                  setFieldErrors((p) => {
                    const n = { ...p };
                    delete n.agreed;
                    return n;
                  });
              }}
              disabled={isLoading}
              className={`mt-0.5 ${fieldErrors.agreed ? "border-warning" : ""}`}
            />
            <Label
              htmlFor="agreed"
              className="text-xs leading-relaxed text-muted-foreground select-none"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary"
                target="_blank"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-semibold text-foreground underline underline-offset-2 transition-colors hover:text-primary"
                target="_blank"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground/60 transition-all duration-200 hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* CTA */}
          <Button
            type="submit"
            className="btn-gradient h-12 w-full text-sm font-semibold [&_svg]:size-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          {/* Register link */}
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
