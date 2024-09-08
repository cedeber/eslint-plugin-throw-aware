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
    console.log("Test");
  } catch {
    throw new Error("Test error");
  }
};

/**
 * @throws {Error}
 */
const test4 = () => {
  try {
    console.log("Test");
  } finally {
    throw new Error("Test error");
  }
};
