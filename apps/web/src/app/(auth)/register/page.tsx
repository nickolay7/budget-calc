/**
 * Страница регистрации (`/register`).
 * Рендерит форму регистрации `RegisterForm` на декоративном фоне
 * с абстрактным SVG-изображением.
 */
"use client";

import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { AuthBackground } from "@/shared/ui/AuthBackground";

/**
 * Страница регистрации нового пользователя.
 *
 * @returns JSX-разметка страницы регистрации.
 */
export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-brand/10 p-4">
      <AuthBackground gradientPrefix="register">
        {/* Floating animated blobs overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full"
            style={{
              background: "oklch(0.5 0.14 255 / 0.12)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute -bottom-20 left-1/4 h-80 w-80 animate-float rounded-full"
            style={{
              background: "oklch(0.38 0.16 285 / 0.08)",
              filter: "blur(70px)",
              animationDelay: "2s",
            }}
          />
        </div>
      </AuthBackground>

      {/* Card shifted up (golden ratio ~40% from top) */}
      <div className="relative z-10 mt-[-5vh] w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
