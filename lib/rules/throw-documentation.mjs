/**
 * @type {import("eslint").Rule.RuleModule}
 */
export default {
  meta: {
    type: "suggestion",
    docs: {
      description: "enforce JSDoc @throws tag for functions that throw exceptions",
      category: "Best Practices",
      recommended: "error",
    },
    messages: {
      missingThrows: "Function throws '{{type}}' but lacks a @throws tag in JSDoc.",
    },
    schema: [], // no options
  },
  create(context) {
    /** @param {import("estree").Statement[]} block */
    function getThrowTypes(block = []) {
      const throwTypes = new Set();

      /** @param {import("estree").Statement[]} block */
      function checkAndAddThrowType(block = []) {
        const handlerThrowTypes = getThrowTypes(block);
        if (handlerThrowTypes.size > 0) {
          throwTypes.add(...handlerThrowTypes);
        }
      }

      // block may be another function?
      if (Array.isArray(block)) {
        for (const statement of block) {
          if (statement.type === "ThrowStatement") {
            // Assuming the argument is an Expression that can be evaluated to get the error type
            if (
              statement.argument.type === "NewExpression" &&
              statement.argument.callee.name === "Error"
            ) {
              throwTypes.add("Error"); // Generic Error or customize based on arguments if possible
            } else if (statement.argument.type === "Identifier") {
              throwTypes.add(statement.argument.name); // Assuming the identifier is an error type
            } else {
              throwTypes.add("Unknown"); // For other types of throws
            }
          }

          // Handle TryStatement
          if (statement.type === "TryStatement") {
            if (statement.handler) {
              checkAndAddThrowType(statement.handler.body.body);
            }

            if (statement.finalizer) {
              checkAndAddThrowType(statement.finalizer.body);
            }
          }

          // Handle IfStatement
          if (statement.type === "IfStatement") {
            checkAndAddThrowType([statement.consequent]);
            statement.alternate && checkAndAddThrowType([statement.alternate]);
          }

          // Handle DoWhileStatement and WhileStatement
          if (statement.type === "DoWhileStatement" || statement.type === "WhileStatement") {
            checkAndAddThrowType([statement.body]);
          }

          // Handle ForStatement and ForInStatement
          if (
            statement.type === "ForStatement" ||
            statement.type === "ForInStatement" ||
            statement.type === "ForOfStatement"
          ) {
            checkAndAddThrowType([statement.body]);
          }

          // Handle SwitchStatement
          if (statement.type === "SwitchStatement") {
            for (const switchCase of statement.cases) {
              checkAndAddThrowType(switchCase.consequent);
            }
          }

          // Handle BlockStatement
          if (statement.type === "BlockStatement") {
            checkAndAddThrowType(statement.body);
          }
        }
      }

      return throwTypes;
    }

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
