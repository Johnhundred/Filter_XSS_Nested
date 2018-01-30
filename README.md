# Filter_XSS_Nested

Node.js XSS filter module. Will filter provided variable, relying on https://www.npmjs.com/package/xss-filters - import the xssProtect function and pass a var into it to sanitize it.

The filter function handles numbers, booleans, strings, objects, and iterables (Arrays, maps, sets, etc.), as well as nested objects/iterables, though it will only actually filter strings.

## Notice

:construction: :construction: :construction: Work In Progress :construction: :construction: :construction:

Meaning: Certain things are lacking.

### Current Bugs / To Do

No iteration limit: Objects with circular references will continue to run forever - until your server crashes.

Fix: Implement an iteration depth counter, with the option to set iteration depth count, or disable it.
