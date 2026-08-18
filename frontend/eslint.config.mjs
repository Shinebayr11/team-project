import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // Ported verbatim from the standalone WhyNot app, which linted under a
    // different config. Downgraded rather than rewritten so this code stays
    // diffable against its source; tighten these as it gets adopted.
    files: [
      "components/**/*.{ts,tsx}",
      "features/**/*.{ts,tsx}",
      "store/**/*.{ts,tsx}",
      "hooks/**/*.{ts,tsx}",
      "data/**/*.{ts,tsx}",
      "types/**/*.{ts,tsx}",
      "lib/router.tsx",
    ],
    ignores: ["components/live/**", "components/ui/button.tsx"],
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
