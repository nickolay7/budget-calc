import nextVitals from "eslint-config-next/core-web-vitals";
import base from "./base.js";

/**
 * ESLint-конфиг для Next.js (apps/web).
 * Базовые правила + core-web-vitals от eslint-config-next.
 */
export default [
  ...base,
  ...nextVitals,
  {
    rules: {
      // Отключено: новое агрессивное правило из react-hooks v7, которое
      // помечает идиоматический паттерн fetch-in-effect (асинхронный колбэк
      // вызывает setState до первого await). Рефакторинг логики загрузки
      // данных выходит за рамки линт-настройки.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
