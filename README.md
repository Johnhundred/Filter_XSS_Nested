# Filter_XSS_Nested
Node.js filter function to recursively filter nested objects/arrays, relying on https://www.npmjs.com/package/xss-filters - import the xssProtect function and pass a var into it to sanitize it.

## Notice

This is a :construnction: Work In Progress :construction: - meaning certain things are lacking. For example, there is no iteration limit, meaning that objects with circular references will continue to run forever - until your server crashes. This will be implemented eventually.
