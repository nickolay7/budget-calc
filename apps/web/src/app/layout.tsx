import type { Metadata } from "next";
import "@/styles/globals.css";
import { AuthProvider } from "./providers/AuthProvider";

/**
 * Метаданные корневого приложения — глобальный заголовок и описание.
 */
export const metadata: Metadata = {
  title: "Budget Calc",
  description: "Personal expense tracker",
};

/**
 * Корневой макет приложения (`/`).
 * Оборачивает всё приложение в `<html>` и `<body>`, подключает AuthProvider
 * для проверки аутентификации при монтировании.
 *
 * @param children - Дочерние компоненты (страницы Next.js).
 * @returns HTML-документ с провайдером аутентификации.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
