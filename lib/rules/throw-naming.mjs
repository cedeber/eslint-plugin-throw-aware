import { hasThrowInBlock } from "./utils.mjs";

/**
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce function names to end with a specified suffix (default to 'OrThrow') if they throw exceptions",
      category: "Best Practices",
      recommended: "error",
    },
    messages: {
      missingSuffix:
        "Function '{{name}}' throws an exception but its name does not end with '{{suffix}}'.",
    },
    schema: [
      {
        type: "object",
        properties: {
          suffix: {
            type: "string",
            default: "OrThrow",
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {};
    const suffix = options.suffix ?? "OrThrow";

    /** @param {(import("estree").ArrowFunctionExpression | (import("estree").FunctionDeclaration)) & import("eslint").Rule.NodeParentExtension} node */
    function checkFunctionName(node) {
      const hasThrow = hasThrowInBlock(node.body.body);

      if (hasThrow) {
        const functionName = node.id?.name;

        if (functionName && !functionName.endsWith(suffix)) {
          context.report({
            node: node.id,
            messageId: "missingSuffix",
            data: { name: functionName, suffix },
          });
        }
      }
    }

    return {
      FunctionDeclaration: checkFunctionName,
      FunctionExpression: checkFunctionName,
      ArrowFunctionExpression: checkFunctionName,
    };
  },
};
