import eslintPlugin from "eslint-plugin-eslint-plugin";
import nodePlugin from "eslint-plugin-n";

/** @type import("eslint").Linter.Config[] */
export default [
  eslintPlugin.configs["flat/recommended"],
  nodePlugin.configs["flat/recommended-script"],
  {
    rules: {
      "eslint-plugin/require-meta-docs-description": "error",
      "n/exports-style": ["error", "module.exports"],
    },
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
    ignores: ["/examples"],
  },
];
