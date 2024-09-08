/**
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce JSDoc @throws tag for functions that throw exceptions",
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
    /** @param {import("estree").Statement[]} block */
    function hasThrowInBlock(block = []) {
      return block.some((statement) => {
        if (statement.type === "ThrowStatement") return true;
        if (statement.type === "TryStatement") {
          return (
            (statement.handler &&
              hasThrowInBlock(statement.handler.body.body)) ||
            (statement.finalizer && hasThrowInBlock(statement.finalizer.body))
          );
        }
        return false;
      });
    }

    /** @param {(import("estree").ArrowFunctionExpression | (import("estree").FunctionDeclaration)) & import("eslint").Rule.NodeParentExtension} node */
    function checkThrows(node) {
      const sourceCode = context.sourceCode;
      const jsDocComment = sourceCode.getJSDocComment(node);

      const hasThrow = hasThrowInBlock(node.body.body);

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
    }

    return {
      ArrowFunctionExpression: checkThrows,
      FunctionDeclaration: checkThrows,
    };
  },
};
