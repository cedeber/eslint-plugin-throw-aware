import { hasThrowInBlock } from "../utils.js";

/** @type {import("eslint").Rule.RuleModule} */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "enforce function names to end with a specified suffix (default to 'OrThrow') if they throw exceptions",
      category: "Best Practices",
      recommended: true,
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

    /** @param {(import("estree").ArrowFunctionExpression | import("estree").FunctionExpression | import("estree").FunctionDeclaration) & import("eslint").Rule.NodeParentExtension} node */
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

              const fixes = [];

              // Handle renaming in import and export statements
              for (const statement of allNodes) {
                if (statement.type === "ImportDeclaration") {
                  for (const specifier of statement.specifiers) {
                    if (specifier.imported && specifier.imported.name === functionName) {
                      // Handle import renaming
                      fixes.push(fixer.replaceText(specifier.imported, newName));
                    }
                  }
                } else if (statement.type === "ExportNamedDeclaration" && !statement.declaration) {
                  // Handle named export specifiers like `export { funcName }`
                  for (const specifier of statement.specifiers) {
                    if (specifier.exported.name === functionName) {
                      fixes.push(
                        fixer.replaceText(
                          specifier.exported,
                          `${newName} as ${specifier.local.name}`,
                        ),
                      );
                    }
                  }
                } else if (
                  statement.type === "ExportDefaultDeclaration" &&
                  statement.declaration.id &&
                  statement.declaration.id.name === functionName
                ) {
                  // Handle default export renaming
                  fixes.push(fixer.replaceText(statement.declaration.id, newName));
                }
              }

              // Check if this function is directly exported at its declaration
              if (
                node.parent &&
                node.parent.type === "ExportNamedDeclaration" &&
                node.parent.declaration === node
              ) {
                const exportText = `\n\n/**\n * Backward compatible export.\n * @deprecated Import {@link ${newName}} instead.\n */\nexport const ${node.id.name} = ${newName};\n`;
                fixes.push(fixer.insertTextAfter(node, exportText));
              }

              // Search and replace function usage
              for (const token of sourceCode.ast.tokens) {
                if (token.type === "Identifier" && token.value === functionName) {
                  fixes.push(fixer.replaceText(token, newName));
                }
              }

              return fixes;
            },
          });
        }
      }
    }

    return {
      FunctionDeclaration: checkFunctionName,
      FunctionExpression: checkFunctionName,
      ArrowFunctionExpression: checkFunctionName,
      // ExportDefaultDeclaration(node) {
      //   if (["FunctionDeclaration", "ArrowFunctionExpression"].includes(node.declaration.type)) {
      //     checkFunctionName(node.declaration);
      //   }
      // },
    };
  },
};
