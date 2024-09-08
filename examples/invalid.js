/**
 *
 */
function quux1(foo) {
  throw new Error("err");
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
const quux2 = function (foo) {
  throw new Error("err");
};
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
const quux3 = (foo) => {
  throw new Error("err");
};
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux4(foo) {
  while (true) {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux5(foo) {
  do {
    throw new Error("err");
  } while (true);
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux6(foo) {
  for (var i = 0; i <= 10; i++) {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux7(foo) {
  for (num in [1, 2, 3]) {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux8(foo) {
  for (const num of [1, 2, 3]) {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux9(foo) {
  for (const index in [1, 2, 3]) {
    if (true) {
      throw new Error("err");
    }
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux11(foo) {
  if (true) {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux12(foo) {
  if (false) {
    // do nothing
  } else {
    throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux13(foo) {
  try {
    throw new Error("err");
  } catch (e) {
    throw new Error(e.message);
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux14(foo) {
  try {
    // do nothing
  } finally {
    throw new Error(e.message);
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 *
 */
function quux15(foo) {
  const a = "b";
  switch (a) {
    case "b":
      throw new Error("err");
  }
}
// Message: Missing JSDoc @throws declaration.

/**
 * @throws
 */
function quux16() {}

/**
 *
 */
const directThrowAfterArrow = (b) => {
  const a = () => {};
  if (b) {
    throw new Error("oops");
  }
  return a;
};
// Message: Missing JSDoc @throws declaration.

/**
 * @throws {never}
 */
function quux17(foo) {
  throw new Error("err");
}
// Message: JSDoc @throws declaration set to "never" but throw value found.
