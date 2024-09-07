import fs from "fs";
import throwDocumentation from "./rules/throw-documentation.mjs";

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")
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
    "throw-documentation": throwDocumentation,
  },
  processors: {},
};

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        "eslint-plugin-throw": plugin,
      },
      rules: {
        "eslint-plugin-throw/throw-documentation": "error",
      },
      languageOptions: {
        globals: {
          myGlobal: "readonly",
        },
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
        },
      },
    },
  ],
});

export default plugin;
