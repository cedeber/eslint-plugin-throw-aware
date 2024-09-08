import { hasThrowInBlock } from "../utils.mjs";

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
    fixable: "code",
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
            fix(fixer) {
              const sourceCode = context.sourceCode;
              const allNodes = sourceCode.ast.body;
              const newName = `${functionName}${suffix}`;

              const importExportFixes = [];

              // Search and replace imports and exports
              allNodes.forEach((statement) => {
                if (statement.type === "ImportDeclaration") {
                  statement.specifiers.forEach((specifier) => {
                    if (specifier.imported && specifier.imported.name === node.id.name) {
                      // Handle import renaming
                      importExportFixes.push(
                        fixer.replaceText(specifier, `${newName} as ${specifier.local.name}`),
                      );
                    }
                  });
                } else if (
                  statement.type === "ExportNamedDeclaration" &&
                  statement.declaration === null
                ) {
                  // Handle named export specifiers like `export { funcName }`
                  statement.specifiers.forEach((specifier) => {
                    if (specifier.exported.name === node.id.name) {
                      importExportFixes.push(
                        fixer.replaceText(specifier, `${newName} as ${specifier.local.name}`),
                      );
                    }
                  });
                } else if (
                  statement.type === "ExportDefaultDeclaration" &&
                  statement.declaration.id &&
                  statement.declaration.id.name === node.id.name
                ) {
                  // Handle default export renaming
                  importExportFixes.push(fixer.replaceText(node.id, newName));
                }
              });

              // Check if this function is directly exported at its declaration
              if (
                node.parent &&
                node.parent.type === "ExportNamedDeclaration" &&
                node.parent.declaration === node
              ) {
                let insertPosition = node.range[1]; // End of the function declaration

                // Prepare the text to insert
                const exportText = `\n\n/**\n * Backward compatible export.\n * @deprecated Import {@link ${newName}} instead.\n */\nexport const ${node.id.name} = ${newName};\n`;

                // Insert the new export statement
                importExportFixes.push(
                  fixer.insertTextBeforeRange([insertPosition, insertPosition], exportText),
                );
              }

              // Rename the function
              importExportFixes.push(fixer.insertTextAfter(node.id, suffix));

              return importExportFixes;
            },
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
