function test1() {
  throw new Error("Test error");
}

/**
 * @throws {Error}
 */
function test2() {
  throw new Error("Test error");
}

const test3 = () => {
  try {
    throw new Error("Test error");
  } finally {
    throw new Error("Test error");
  }
};
