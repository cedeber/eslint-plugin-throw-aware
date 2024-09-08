/**
 * @throws {Error} An error.
 */
function quux0() {
  throw new Error("err");
}

/**
 * @throws An error.
 */
function quux1() {
  throw new Error("err");
}

/**
 *
 */
function quux2(foo) {
  try {
    throw new Error("err");
  } catch (e) {}
}

/**
 * @throws {object}
 */
function quux3(foo) {
  throw new Error("err");
}

/**
 * @inheritdoc
 */
function quux4(foo) {
  throw new Error("err");
}

/**
 * @abstract
 */
function quux5(foo) {
  throw new Error("err");
}

/**
 *
 */
function quux6(foo) {}

/**
 * @type {MyCallback}
 */
function quux7() {
  throw new Error("err");
}

/**
 *
 */
const itself = (n) => n;

/**
 * Not tracking on nested function
 */
const nested = () => () => {
  throw new Error("oops");
};

/**
 */
async function foo() {
  throw Error("bar");
}

/**
 * @throws {never}
 */
function quux8(foo) {}
