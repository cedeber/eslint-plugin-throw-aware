import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";
import avaPlugin from "eslint-plugin-ava";

/** @type import("eslint").Linter.Config[] */
export default [
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  eslintPlugin.configs["flat/recommended"],
  nodePlugin.configs["flat/recommended-script"],
  {
    rules: {
      "eslint-plugin/require-meta-docs-description": "error",
      "n/exports-style": ["error", "module.exports"],
    },
  },
  { languageOptions: { ecmaVersion: 2020, sourceType: "module" } },
  {
    files: ["tests/*.js"],
    ...avaPlugin.configs["flat/recommended"],
  },
  { ignores: ["node_modules", "cjs", "examples"] },
];
