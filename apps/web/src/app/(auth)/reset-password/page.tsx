"use client";

import { Suspense } from "react";
import { ResetPasswordForm } from "@/features/auth/ui/ResetPasswordForm";
import { ShieldCheck } from "lucide-react";

function ResetPasswordContent() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-brand/10 p-4">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 animate-float rounded-full"
          style={{
            background: "oklch(0.55 0.16 255 / 0.15)",
            filter: "blur(60px)",
          }}
        />
        <div className="absolute -bottom-20 left-1/4 h-80 w-80 animate-float rounded-full"
          style={{
            background: "oklch(0.48 0.14 275 / 0.1)",
            filter: "blur(70px)",
            animationDelay: "2s",
          }}
        />
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
