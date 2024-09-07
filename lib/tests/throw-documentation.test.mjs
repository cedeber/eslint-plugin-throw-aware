import test from "ava";
import AvaRuleTester from "eslint-ava-rule-tester";
import rule from "../rules/throw-documentation.mjs";

const ruleTester = new AvaRuleTester(test, {
  languageOptions: { ecmaVersion: 2021, sourceType: "module" },
});

ruleTester.run("throw-documentation", rule, {
  valid: [
    // Function Declaration
    {
      code: `
      /**
       * @throws
       */
      function test() {
        throw new Error('test');
      }
      `,
    },
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
    // Arrow Function Expression
    {
      code: `
      /**
       * @throws
       */
      const test = () => {
        throw new Error('test');
      }
      `,
    },
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
  invalid: [
    {
      code: `
      function test() {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows" }],
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
      errors: [{ messageId: "missingThrows" }],
    },
    {
      code: `
      const test = () => {
        throw new Error('test');
      }
      `,
      errors: [{ messageId: "missingThrows" }],
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
      errors: [{ messageId: "missingThrows" }],
    },
  ],
});
