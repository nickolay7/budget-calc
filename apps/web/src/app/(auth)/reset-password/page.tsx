/**
 * Страница сброса пароля (`/reset-password`).
 * Оборачивает контент сброса пароля в `<Suspense>` для поддержки
 * `useSearchParams`, который читает токен сброса из URL.
 */
"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/ui/ResetPasswordForm";
import { ShieldCheck } from "lucide-react";

/**
 * Основное содержимое страницы сброса пароля.
 * Рендерит форму `ResetPasswordForm` на декоративном фоне с логотипом.
 * Вынесена в отдельный компонент для оборачивания в `<Suspense>`.
 *
 * @returns JSX-разметка с формой сброса пароля.
 */
function ResetPasswordContent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-brand/10 p-4">
      {/* Abstract SVG background image */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg
          className="h-full w-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="prGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.38 0.16 285 / 0.15)" />
              <stop offset="100%" stopColor="oklch(0.5 0.14 255 / 0.05)" />
            </linearGradient>
            <linearGradient id="prWarm" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.68 0.16 55 / 0.08)" />
              <stop offset="100%" stopColor="oklch(0.38 0.16 285 / 0)" />
            </linearGradient>
            <linearGradient id="prAccent" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="oklch(0.5 0.14 255 / 0.12)" />
              <stop offset="100%" stopColor="oklch(0.38 0.16 285 / 0)" />
            </linearGradient>
          </defs>
          <ellipse cx="200" cy="150" rx="400" ry="350" fill="url(#prGlow)" />
          <ellipse cx="1200" cy="700" rx="450" ry="300" fill="url(#prWarm)" />
          <ellipse cx="1100" cy="100" rx="300" ry="250" fill="url(#prAccent)" />
          <circle cx="350" cy="650" r="60" fill="oklch(0.38 0.16 285 / 0.06)" />
          <circle cx="1050" cy="450" r="40" fill="oklch(0.5 0.14 255 / 0.08)" />
          <circle cx="750" cy="800" r="80" fill="oklch(0.68 0.16 55 / 0.04)" />
          <path d="M-100 400 Q300 200 700 350 T1440 150" fill="none" stroke="oklch(0.38 0.16 285 / 0.06)" strokeWidth="2" />
          <path d="M-100 500 Q400 650 800 450 T1440 550" fill="none" stroke="oklch(0.5 0.14 255 / 0.05)" strokeWidth="1.5" />
          <circle cx="150" cy="300" r="3" fill="oklch(0.38 0.16 285 / 0.15)" />
          <circle cx="500" cy="120" r="4" fill="oklch(0.5 0.14 255 / 0.12)" />
          <circle cx="900" cy="250" r="2" fill="oklch(0.68 0.16 55 / 0.15)" />
          <circle cx="1250" cy="350" r="3" fill="oklch(0.38 0.16 285 / 0.1)" />
          <circle cx="600" cy="700" r="2" fill="oklch(0.5 0.14 255 / 0.12)" />
          <circle cx="1300" cy="600" r="4" fill="oklch(0.68 0.16 55 / 0.08)" />
        </svg>

        {/* Floating animated blobs overlay */}
        <div className="absolute inset-0">
          <div className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full"
            style={{
              background: "oklch(0.5 0.14 255 / 0.12)",
              filter: "blur(60px)",
            }}
          />
          <div className="absolute -bottom-20 left-1/4 h-80 w-80 animate-float rounded-full"
            style={{
              background: "oklch(0.38 0.16 285 / 0.08)",
              filter: "blur(70px)",
              animationDelay: "2s",
            }}
          />
        </div>
      </div>

      {/* Logo */}
      <div className="relative mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-lg">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          <span className="gradient-text">Budget</span> Calc
        </span>
      </div>

      {/* Card shifted up */}
      <div className="relative z-10 mt-[-3vh] w-full max-w-sm">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

/**
 * Страница сброса пароля, обёрнутая в `<Suspense>`.
 * Загружает `ResetPasswordContent` или отображает спиннер.
 *
 * @returns JSX-разметка с Suspense-обёрткой.
 */
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
