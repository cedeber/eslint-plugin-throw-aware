/**
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce JSDoc @throws tag for functions that throw exceptions",
      category: "Best Practices",
      recommended: "error",
    },
    messages: {
      missingThrows:
        "Function throws an exception but lacks a @throws tag in JSDoc.",
    },
    schema: [], // no options
  },
  create(context) {
    return {
      ArrowFunctionExpression(node) {
        const sourceCode = context.sourceCode;
        const jsDocComment = sourceCode.getJSDocComment(node);

        // if (!jsDocComment) return; // If there's no JSDoc, skip

        const hasThrow = node.body.body.some(
          (statement) => statement.type === "ThrowStatement"
        );

        if (hasThrow) {
          // Missing JSDoc @throws
          if (!jsDocComment) {
            context.report({
              node: node,
              messageId: "missingThrows",
            });
            return;
          }

          const throwsTag = jsDocComment.value.includes("@throws");
          if (!throwsTag) {
            context.report({
              node: node,
              messageId: "missingThrows",
            });
          }
        }
      },
      FunctionDeclaration(node) {
        const sourceCode = context.sourceCode;
        const jsDocComment = sourceCode.getJSDocComment(node);

        // if (!jsDocComment) return; // If there's no JSDoc, skip

        const hasThrow = node.body.body.some(
          (statement) => statement.type === "ThrowStatement"
        );

        if (hasThrow) {
          // Missing JSDoc @throws
          if (!jsDocComment) {
            context.report({
              node: node,
              messageId: "missingThrows",
            });
            return;
          }

          const throwsTag = jsDocComment.value.includes("@throws");
          if (!throwsTag) {
            context.report({
              node: node,
              messageId: "missingThrows",
            });
          }
        }
      },
    };
  },
};
