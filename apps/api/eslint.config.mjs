import prettier from "eslint-config-prettier";
import nestConfig from "@budget-calc/eslint-config/nest";

export default [
  ...nestConfig,
  prettier,
  {
    ignores: ["dist/**", "**/*.js", "**/*.js.map", "**/*.d.ts", "**/*.d.ts.map"],
  },
];
