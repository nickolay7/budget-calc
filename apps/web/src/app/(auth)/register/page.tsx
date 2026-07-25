"use client";

import { RegisterForm } from "@/features/auth/ui/RegisterForm";

export default function RegisterPage() {
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

      {/* Card shifted up (golden ratio ~40% from top) */}
      <div className="relative z-10 mt-[-5vh] w-full max-w-sm">
        <RegisterForm />
      </div>
    </div>
  );
}
