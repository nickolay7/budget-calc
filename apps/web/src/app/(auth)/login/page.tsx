"use client";

import { LoginForm } from "@/features/auth/ui/LoginForm";
import { Wallet } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: Visual anchor (hidden on mobile) ── */}
      <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-auth p-12 lg:flex">
        {/* Animated blur circles */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -left-20 -top-20 h-72 w-72 animate-float rounded-full"
            style={{
              background:
                "oklch(0.6 0.2 310 / 0.3)",
              filter: "blur(60px)",
            }}
          />
          <div
            className="absolute -bottom-16 left-1/3 h-96 w-96 animate-float rounded-full"
            style={{
              background:
                "oklch(0.5 0.18 250 / 0.25)",
              filter: "blur(70px)",
              animationDelay: "1.5s",
            }}
          />
          <div
            className="absolute right-0 top-1/3 h-64 w-64 animate-float rounded-full"
            style={{
              background:
                "oklch(0.7 0.15 45 / 0.15)",
              filter: "blur(50px)",
              animationDelay: "3s",
            }}
          />
        </div>

        {/* Brand content */}
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 shadow-lg backdrop-blur-sm">
            <Wallet className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Budget Calc
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-lg text-white/60">
            Track your expenses, set budgets, and take control of your
            financial life.
          </p>

          {/* Feature list */}
          <div className="mx-auto mt-10 grid gap-4 text-left">
            {[
              "Track income & expenses in real time",
              "Set monthly budgets per category",
              "Visual insights into spending habits",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 mt-auto text-xs text-white/30">
          © 2026 Budget Calc
        </p>
      </div>

      {/* ── Right: Form panel ── */}
      <div className="flex w-full items-center justify-center bg-background p-6 lg:w-[480px]">
        <LoginForm />
      </div>
    </div>
  );
}
