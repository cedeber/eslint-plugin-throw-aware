/** @param {import("estree").Statement[]} block */
export function getThrowTypes(block = []) {
  /** @type {Set<string>} */
  const throwTypes = new Set();

  /** @param {import("estree").Statement[]} block */
  function checkAndAddThrowType(block = []) {
    const handlerThrowTypes = getThrowTypes(block);
    if (handlerThrowTypes.size > 0) {
      for (const type of handlerThrowTypes) {
        throwTypes.add(type);
      }
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

        if (statement.alternate) {
          checkAndAddThrowType([statement.alternate]);
        }
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

/**
 * @param {import("estree").Statement[]} block
 * @returns {boolean}
 */
export function hasThrowInBlock(block = []) {
  if (!Array.isArray(block)) return false;

  return block.some((statement) => {
    if (statement.type === "ThrowStatement") return true;

    // Handle TryStatement
    if (statement.type === "TryStatement") {
      return (
        (statement.handler && hasThrowInBlock(statement.handler.body.body)) ||
        (statement.finalizer && hasThrowInBlock(statement.finalizer.body))
      );
    }

    // Handle IfStatement
    if (statement.type === "IfStatement") {
      return (
        hasThrowInBlock([statement.consequent]) ||
        (statement.alternate && hasThrowInBlock([statement.alternate]))
      );
    }

    // Handle DoWhileStatement and WhileStatement
    if (statement.type === "DoWhileStatement" || statement.type === "WhileStatement") {
      return hasThrowInBlock([statement.body]);
    }

    // Handle ForStatement and ForInStatement
    if (
      statement.type === "ForStatement" ||
      statement.type === "ForInStatement" ||
      statement.type === "ForOfStatement"
    ) {
      return hasThrowInBlock([statement.body]);
    }

    // Handle SwitchStatement
    if (statement.type === "SwitchStatement") {
      return statement.cases.some((switchCase) => hasThrowInBlock(switchCase.consequent));
    }

    // Handle BlockStatement
    if (statement.type === "BlockStatement") {
      return hasThrowInBlock(statement.body);
    }

    return false;
  });
}
