import test from "ava";
import AvaRuleTester from "eslint-ava-rule-tester";
import rule from "../lib/rules/throw-function-naming.js";

const ruleTester = new AvaRuleTester(test, {
  languageOptions: { ecmaVersion: 2020, sourceType: "module" },
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
    // Async function that throws error
    {
      code: `
      async function getDataOrThrow() {
        throw new Error("No data");
      }
      `,
    },
    // Nested function that throws error
    // FIXME outerFunction should be renamed to outerFunctionOrThrow too
    {
      code: `
      function outerFunction() {
        function innerFunctionOrThrow() {
          throw new Error("Inner error");
        }
        innerFunctionOrThrow();
      }
      `,
    },
    // Function with no JSDoc comments
    {
      code: `
      function doSomethingOrThrow() {
        throw new Error("Something went wrong");
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
    // Async function without OrThrow suffix
    {
      code: `
      async function getData() {
        throw new Error("No data");
      }
      `,
      errors: [{ messageId: "missingSuffix", data: { name: "getData", suffix: "OrThrow" } }],
      output: `
      async function getDataOrThrow() {
        throw new Error("No data");
      }
      `,
    },
    // Nested function without OrThrow suffix
    {
      code: `
      function outerFunction() {
        function innerFunction() {
          throw new Error("Inner error");
        }
        innerFunction();
      }
      `,
      errors: [{ messageId: "missingSuffix", data: { name: "innerFunction", suffix: "OrThrow" } }],
      output: `
      function outerFunction() {
        function innerFunctionOrThrow() {
          throw new Error("Inner error");
        }
        innerFunctionOrThrow();
      }
      `,
    },
  ],
});
