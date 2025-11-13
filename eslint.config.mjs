import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      globals: globals.node,
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
    },

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettier,
    ],

    rules: {
      "prettier/prettier": "warn",
    },
  },
]);

