import fs from "fs";
import throwDocumentation from "./rules/throw-documentation.mjs";

const pkg = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
);

/**
 * @type {import("eslint").ESLint.Plugin}
 */
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  configs: {},
  rules: {
    "require-throws-doc": throwDocumentation,
    // "throw-function-naming": ,
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
      // "throw-aware/throw-function-naming": ["error", { suffix: "OrThrow" }],
    },
  },
});

export default plugin;
