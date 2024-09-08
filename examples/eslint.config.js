import globals from "globals";
import pluginJs from "@eslint/js";
import pluginThrowAware from "eslint-plugin-throw-aware";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginThrowAware.configs.recommended,
];
