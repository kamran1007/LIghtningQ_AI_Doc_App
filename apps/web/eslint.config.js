import { nextJsConfig } from "@repo/eslint-config/next-js";

/** @type {import("eslint").Linter.Config} */
export default {
  ...nextJsConfig,
  rules: {
    ...nextJsConfig.rules,
    // ✅ Turn off prop-types since TypeScript handles props
    "react/prop-types": "off",

    // ✅ Control explicit any usage
    //   - "warn" = show warning but allow
    //   - "off"  = completely allow
    //   - "error" = block usage (default in strict setups)
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
