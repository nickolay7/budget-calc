import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Базовый ESLint-конфиг (flat config) для TypeScript-кода.
 * Общие правила для всех воркспейсов.
 */
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
