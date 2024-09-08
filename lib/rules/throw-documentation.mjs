import { getThrowTypes } from "./utils.mjs";

/**
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce JSDoc @throws tag for functions that throw exceptions",
      category: "Best Practices",
      recommended: "warn",
    },
    messages: {
      missingThrows: "Function throws '{{type}}' but lacks a @throws tag in JSDoc.",
    },
    schema: [], // no options
  },
  create(context) {
    /** @param {(import("estree").ArrowFunctionExpression | (import("estree").FunctionDeclaration)) & import("eslint").Rule.NodeParentExtension} node */
    function checkThrows(node) {
      const sourceCode = context.sourceCode;
      const jsDocComment = sourceCode.getJSDocComment(node);

      const throwTypes = getThrowTypes(node.body.body);

      if (throwTypes.size > 0) {
        // Missing JSDoc @throws
        if (!jsDocComment) {
          context.report({
            node: node,
            messageId: "missingThrows",
            data: { type: Array.from(throwTypes).join(", ") },
          });
          return;
        }

        for (const type of throwTypes) {
          const throwsTag = jsDocComment.value.includes(`@throws {${type}}`);

          if (!throwsTag) {
            context.report({
              node: node,
              messageId: "missingThrows",
              data: { type },
            });
          }
        }
      }
    }

    return {
      ArrowFunctionExpression: checkThrows,
      FunctionDeclaration: checkThrows,
      FunctionExpression: checkThrows,
    };
  },
};
