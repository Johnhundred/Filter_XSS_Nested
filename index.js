const xssFilters = require('xss-filters');

const helpers = {};

// Filter provided var
helpers.getXssFilteredVar = (str) => {
  // Is var a string?
  if (helpers.isString(str)) {
    return xssFilters.inHTMLData(str);
  }

  return str;
};

// Check if provided var is a string
helpers.isString = value => typeof value === 'string';

// Check if provided var is an array
helpers.isArray = value => Object.prototype.toString.call(value) === '[object Array]';

// Check if provided var is an object
helpers.isObject = value => !helpers.isArray(value) && value instanceof Object;

// Check if provided var is an array of objects
// Check first item in array, assume it is indicative of the rest
helpers.isArrayOfObjects = value => helpers.isArray(value) && helpers.isObject(value[0]);

// Filter provided, potentially nested, object from XSS attempts
// If an array is encountered, the first element is tested
// Depending on the datatype of the first element, a filtering function is used
helpers.getXssFilteredObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    // Is the current object value an array?
    if (helpers.isArray(obj[key])) {
      // Is first array element an object or another type?
      if (helpers.isObject(obj[key][0])) {
        obj[key] = helpers.getXssFilteredArrayOfObjects(obj[key]);
      } else {
        obj[key] = helpers.getXssFilteredArray(obj[key]);
      }
    } else if (helpers.isObject(obj[key])) {
      // Current object value was an object, trigger recursion to iterate over the nested object
      obj[key] = helpers.getXssFilteredObject(obj[key]);
    }

    // Current object value was not an array or object, is it a string?
    if (helpers.isString(obj[key])) {
      obj[key] = helpers.getXssFilteredVar(obj[key]);
    }
  });

  return obj;
};

// Filter provided array of, potentially nested, objects from XSS attempts
helpers.getXssFilteredArrayOfObjects = (arrObj) => {
  // We are getting an array of objects
  // Iterate over each object in the array
  arrObj.map(obj => helpers.getXssFilteredObject(obj));

  return arrObj;
};

helpers.getXssFilteredArray = (arr) => {
  // We are getting an array of non-objects
  // Iterate over each and filter
  arr.map(item => helpers.getXssFilteredVar(item));

  return arr;
};

helpers.xssProtect = item =>
  new Promise((resolve) => {
    // Is item an array?
    if (helpers.isArray(item)) {
      // Item is an array, is it an array of objects?
      if (helpers.isObject(item[0])) {
        const newItem = helpers.getXssFilteredArrayOfObjects(item);
        resolve(newItem);
      } else {
        const newItem = helpers.getXssFilteredArray(item);
        resolve(newItem);
      }
    // Item was not an array, is it an object?
    } else if (helpers.isObject(item)) {
      const newItem = helpers.getXssFilteredObject(item);
      resolve(newItem);
    } else {
      const newItem = helpers.getXssFilteredVar(item);
      resolve(newItem);
    }
  });

module.exports = helpers;
