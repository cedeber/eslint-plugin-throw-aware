import test from "ava";
import AvaRuleTester from "eslint-ava-rule-tester";
import rule from "../rules/throw-documentation.mjs";

const ruleTester = new AvaRuleTester(test, {
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});

ruleTester.run("throw-documentation", rule, {
  valid: [
    {
      code: `
      /**
       * @throws {Error}
       */
      function test() {
        throw new Error('test');
      }
      `,
    },
  ],
  invalid: [
    {
      code: `
      function test() {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows" }],
    },
  ],
});
