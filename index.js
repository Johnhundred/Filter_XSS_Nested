const xssFilters = require('xss-filters');

module.exports.filterString = (str) => {
  return xssFilters.inHTMLData(str);
};

// Check if provided var is a string
module.exports.isString = value => typeof value === 'string';

// Check if provided var is an array
module.exports.isArray = value => Object.prototype.toString.call(value) === '[object Array]';

// Check if provided var is an object
module.exports.isObject = value => !module.exports.isArray(value) && value instanceof Object;

// Check if provided var is an iterable
module.exports.isIterable = value => typeof value[Symbol.iterator] === 'function';

module.exports.getVarType = (value) => {
  // Is number or boolean?
  if (typeof value === 'number' || typeof value === 'boolean') {
    return 'skip';
  }

  // is string?
  if (module.exports.isString(value)) {
    return 'string';
  }

  // String, Array, TypedArray, Map and Set all implement the iterable protocol. Strings are caught above.
  if (module.exports.isIterable(value)) {
    return 'iterable';
  }

  // is object?
  if (module.exports.isObject(value)) {
    return 'object';
  }

  return 'skip';
};

module.exports.handler = (item) => {
  // Detect incoming type
  const type = module.exports.getVarType(item);

  // If it's a skip, skip it.
  if (type === 'skip') {
    return item;
  }

  // If it's a string, filter it and move on.
  if (type === 'string') {
    return module.exports.filterString(item);
  }

  // If it's an object, iterate over the values recursively.
  if (type === 'object') {
    Object.keys(item).forEach((key) => {
      item[key] = module.exports.handler(item[key]);
    });

    return item;
  }

  // If it's an iterable, iterate over the values recursively.
  if (type === 'iterable') {
    for (let i of item.entries()) {
      item[i[0]] = module.exports.handler(i[1]);
    }

    return item;
  }
};

module.exports.xssProtect = (item) => {
  return module.exports.handler(item);
};
