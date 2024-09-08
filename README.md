# Throw-Aware ESLint Plugin

A plugin for ESLint to enforce naming conventions and JSDoc annotations for functions that throw errors.

## Features

- **Function Naming**: Enforces a naming convention for functions that can throw, e.g., `functionNameOrThrow()`.
- **JSDoc Enforcement**: Requires JSDoc `@throws` tags for functions that throw errors.

### Not implemented yet

- Support `@throws` but without a type. Optional.
- Check if a `@throws` tag is set, but not required.
- Support of anonymous functions
- Support of async function

## Installation

```sh
npm install eslint-plugin-throw-aware --save-dev
```

## Usage

### Flat config

```js
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginThrowAware from "eslint-plugin-throw-aware";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginThrowAware.configs.recommended,
];
```

### Configuration

You can customize the behavior of this plugin by adjusting the rule settings:

```js
{
  plugins: {
    "throw-aware": pluginThrowAware
  },
  // Recommended configuration
  rules: {
    "throw-aware/throw-function-naming": ["error", { suffix: "OrThrow" }],
    "throw-aware/require-throws-doc": ["warn"]
  }
}
```

- **suffix**: Customizes the expected suffix for function names. Default is `OrThrow`.

## Rules

### `throw-aware/throw-function-naming`

Ensures functions that throw have names ending with `OrThrow`.

#### Example of incorrect code

```js
function getData() {
  if (!data) throw new Error("No data");
}
```

#### Corrected code

```js
function getDataOrThrow() {
  if (!data) throw new Error("No data");
}
```

### `throw-aware/require-throws-doc`

Requires a `@throws` tag in JSDoc for functions that throw.

#### Example of incorrect code

```js
/**
 * Fetches user data.
 */
function fetchUserDataOrThrow() {
  if (!userData) throw new Error("User data not found");
}
```

#### Corrected code

```js
/**
 * Fetches user data.
 * @throws {Error} When user data is not found.
 */
function fetchUserDataOrThrow() {
  if (!userData) throw new Error("User data not found");
}
```

## Why Use This Plugin?

- **Clarity**: Instantly recognize functions that might throw errors.
- **Documentation**: Ensures that all throwing functions are properly documented, improving code maintainability.
- **Consistency**: Promotes a consistent coding style across projects where error handling is critical.

## Contribution

Feel free to open issues or pull requests to improve this plugin.
