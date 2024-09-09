import test from "ava";
import AvaRuleTester from "eslint-ava-rule-tester";
import rule from "../lib/rules/require-throws-doc.mjs";

const ruleTester = new AvaRuleTester(test, {
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});

ruleTester.run("require-throws-doc", rule, {
  /** @type {import("eslint").RuleTester.ValidTestCase[]} */
  valid: [
    // Function Declaration
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
    {
      code: `
      /**
       * @throws {Error} This function throws an error
       */
      function test() {
        if (true) {
          throw new Error('test');
        }
      }
      `,
    },
    {
      code: `
      function test() {
        try {
          throw new Error('test');
        } catch (e) {
          console.error(e);
        }
      }
      `,
    },
    {
      code: `
      /** @throws {Error} */
      const test = () => {
        try {
          console.log('test');
        } catch {
          throw new Error("Test error");
        }
      }
      `,
    },
    {
      code: `
      /** @throws {Error} */
      const test = () => {
        try {
          console.log('test');
        } finally {
          throw new Error("Test error");
        }
      }
      `,
    },
    // Arrow Function Expression
    {
      code: `
      /**
       * @throws {Error}
       */
      const test = () => {
        throw new Error('test');
      }
      `,
    },
    {
      code: `
      /**
       * @throws {Error} This function throws an error
       */
      const test = () => {
        if (true) {
          throw new Error('test');
        }
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
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      /**
       * This function throws an error
       */
      function test() {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      const test = () => {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      const test = () => {
        try {
          console.log('test');
        } catch {
          throw new Error("Test error");
        }
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      const test = () => {
        try {
          console.log('test');
        } finally {
          throw new Error("Test error");
        }
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      /**
       * This function throws an error
       */
      const test = () => {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      /**
       * @throws
       */
      function test() {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
    {
      code: `
      /**
       * @throws
       */
      function test() {
        while(true) {
          throw new Error('err')
        }
      }
      `,
      errors: [{ messageId: "missingThrows", data: { type: "Error" } }],
    },
  ],
});
