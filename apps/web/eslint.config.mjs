import prettier from "eslint-config-prettier";
import nextConfig from "@budget-calc/eslint-config/next";

export default [
  ...nextConfig,
  prettier,
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];
