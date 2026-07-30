"use client";

import type { ReactNode } from "react";

/**
 * Абстрактный SVG-фон для страниц авторизации.
 *
 * Единый компонент для устранения копипасты ~50 строк SVG
 * между register, forgot-password, reset-password и login.
 * Принимает префикс для ID градиентов (чтобы избежать конфликтов
 * при нескольких экземплярах на одной странице) и children
 * для анимированных blur-кругов поверх SVG.
 *
 * @example
 * <AuthBackground gradientPrefix="register">
 *   <div className="absolute inset-0">
 *     <div className="absolute -right-20 -top-20 h-72 w-72 animate-float ..." />
 *   </div>
 * </AuthBackground>
 */
export function AuthBackground({
  gradientPrefix = "bg",
  children,
}: {
  gradientPrefix?: string;
  children?: ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id={`${gradientPrefix}Glow`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.38 0.16 285 / 0.15)" />
            <stop offset="100%" stopColor="oklch(0.5 0.14 255 / 0.05)" />
          </linearGradient>
          <linearGradient
            id={`${gradientPrefix}Warm`}
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="oklch(0.68 0.16 55 / 0.08)" />
            <stop offset="100%" stopColor="oklch(0.38 0.16 285 / 0)" />
          </linearGradient>
          <linearGradient
            id={`${gradientPrefix}Accent`}
            x1="100%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="oklch(0.5 0.14 255 / 0.12)" />
            <stop offset="100%" stopColor="oklch(0.38 0.16 285 / 0)" />
          </linearGradient>
        </defs>

        {/* Large organic blobs */}
        <ellipse
          cx="200"
          cy="150"
          rx="400"
          ry="350"
          fill={`url(#${gradientPrefix}Glow)`}
        />
        <ellipse
          cx="1200"
          cy="700"
          rx="450"
          ry="300"
          fill={`url(#${gradientPrefix}Warm)`}
        />
        <ellipse
          cx="1100"
          cy="100"
          rx="300"
          ry="250"
          fill={`url(#${gradientPrefix}Accent)`}
        />

        {/* Decorative floating shapes */}
        <circle cx="350" cy="650" r="60" fill="oklch(0.38 0.16 285 / 0.06)" />
        <circle cx="1050" cy="450" r="40" fill="oklch(0.5 0.14 255 / 0.08)" />
        <circle cx="750" cy="800" r="80" fill="oklch(0.68 0.16 55 / 0.04)" />

        {/* Abstract curved lines */}
        <path
          d="M-100 400 Q300 200 700 350 T1440 150"
          fill="none"
          stroke="oklch(0.38 0.16 285 / 0.06)"
          strokeWidth="2"
        />
        <path
          d="M-100 500 Q400 650 800 450 T1440 550"
          fill="none"
          stroke="oklch(0.5 0.14 255 / 0.05)"
          strokeWidth="1.5"
        />

        {/* Small decorative dots */}
        <circle cx="150" cy="300" r="3" fill="oklch(0.38 0.16 285 / 0.15)" />
        <circle cx="500" cy="120" r="4" fill="oklch(0.5 0.14 255 / 0.12)" />
        <circle cx="900" cy="250" r="2" fill="oklch(0.68 0.16 55 / 0.15)" />
        <circle cx="1250" cy="350" r="3" fill="oklch(0.38 0.16 285 / 0.1)" />
        <circle cx="600" cy="700" r="2" fill="oklch(0.5 0.14 255 / 0.12)" />
        <circle cx="1300" cy="600" r="4" fill="oklch(0.68 0.16 55 / 0.08)" />
      </svg>

      {children}
    </div>
  );
}
