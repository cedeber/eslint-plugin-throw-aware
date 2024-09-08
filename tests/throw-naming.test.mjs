import test from "ava";
import AvaRuleTester from "eslint-ava-rule-tester";
import rule from "../lib/rules/throw-function-naming.mjs";

const ruleTester = new AvaRuleTester(test, {
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});

ruleTester.run("throw-function-naming", rule, {
  /** @type {import("eslint").RuleTester.ValidTestCase[]} */
  valid: [
    {
      code: `
      function testOrThrow() {
        throw new Error('test');
      }
      `,
    },
  ],
  /** @type {import("eslint").RuleTester.InvalidTestCase[]} */
  invalid: [
    {
      code: `
      function test() {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingSuffix", data: { name: "test", suffix: "OrThrow" } }],
      output: `
      function testOrThrow() {
        throw new Error('test');
      }
      `,
    },
    {
      code: `
      function test() {
        throw new Error('test');
      }
      `,
      options: [{ suffix: "MayFail" }],
      errors: [{ messageId: "missingSuffix", data: { name: "test", suffix: "MayFail" } }],
      output: `
      function testMayFail() {
        throw new Error('test');
      }
      `,
    },
  ],
});
