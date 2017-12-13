# Filter_XSS_Nested

Node.js filter function to recursively filter nested objects/arrays, relying on https://www.npmjs.com/package/xss-filters - import the xssProtect function and pass a var into it to sanitize it.

The filter function handles arrays, objects and simple types, though it will only actually filter strings.

## Notice

:construction: :construction: :construction: Work In Progress :construction: :construction: :construction:

Meaning: Certain things are lacking.

### Current Bugs

No iteration limit: Objects with circular references will continue to run forever - until your server crashes.

Fix: Implement an iteration depth counter, with the option to set iteration depth count, or disable it.


No variable type array support: When the filter encounters an array, it assumes the array is filled with values similar to the first one to save time.

Fix: Implement option to check all array elements separately - and code to do this.
