import { readFileSync } from "fs";
import throwDocumentation from "./rules/require-throws-doc.js";
import throwNaming from "./rules/throw-function-naming.js";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

/** @type {import("eslint").ESLint.Plugin} */
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "require-throws-doc": throwDocumentation,
    "throw-function-naming": throwNaming,
  },
  processors: {},
};

Object.assign(plugin.configs, {
  recommended: {
    plugins: {
      "throw-aware": plugin,
    },
    rules: {
      "throw-aware/require-throws-doc": "warn",
      "throw-aware/throw-function-naming": "error",
    },
  },
});

export default plugin;
