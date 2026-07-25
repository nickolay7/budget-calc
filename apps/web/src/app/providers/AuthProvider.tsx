"use client";

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/entities/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
