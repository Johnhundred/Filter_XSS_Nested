const xssFilters = require('xss-filters');

// Filter provided var
module.exports.getXssFilteredVar = (str) => {
  // Is var a string?
  if (module.exports.isString(str)) {
    return xssFilters.inHTMLData(str);
  }

  return str;
};

// Check if provided var is a string
module.exports.isString = value => typeof value === 'string';

// Check if provided var is an array
module.exports.isArray = value => Object.prototype.toString.call(value) === '[object Array]';

// Check if provided var is an object
module.exports.isObject = value => !module.exports.isArray(value) && value instanceof Object;

// Check if provided var is an array of objects
// Check first item in array, assume it is indicative of the rest
module.exports.isArrayOfObjects = value => module.exports.isArray(value) && module.exports.isObject(value[0]);

// Filter provided, potentially nested, object from XSS attempts
// If an array is encountered, the first element is tested
// Depending on the datatype of the first element, a filtering function is used
module.exports.getXssFilteredObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    // Is the current object value an array?
    if (module.exports.isArray(obj[key])) {
      // Is first array element an object or another type?
      if (module.exports.isObject(obj[key][0])) {
        obj[key] = module.exports.getXssFilteredArrayOfObjects(obj[key]);
      } else {
        obj[key] = module.exports.getXssFilteredArray(obj[key]);
      }
    } else if (module.exports.isObject(obj[key])) {
      // Current object value was an object, trigger recursion to iterate over the nested object
      obj[key] = module.exports.getXssFilteredObject(obj[key]);
    }

    // Current object value was not an array or object, is it a string?
    if (module.exports.isString(obj[key])) {
      obj[key] = module.exports.getXssFilteredVar(obj[key]);
    }
  });

  return obj;
};

// Filter provided array of, potentially nested, objects from XSS attempts
module.exports.getXssFilteredArrayOfObjects = (arrObj) => {
  // We are getting an array of objects
  // Iterate over each object in the array
  arrObj.map(obj => module.exports.getXssFilteredObject(obj));

  return arrObj;
};

module.exports.getXssFilteredArray = (arr) => {
  // We are getting an array of non-objects
  // Iterate over each and filter
  arr.map(item => module.exports.getXssFilteredVar(item));

  return arr;
};

module.exports.xssProtect = item =>
  new Promise((resolve) => {
    // Is item an array?
    if (module.exports.isArray(item)) {
      // Item is an array, is it an array of objects?
      if (module.exports.isObject(item[0])) {
        const newItem = module.exports.getXssFilteredArrayOfObjects(item);
        resolve(newItem);
      } else {
        const newItem = module.exports.getXssFilteredArray(item);
        resolve(newItem);
      }
    // Item was not an array, is it an object?
    } else if (module.exports.isObject(item)) {
      const newItem = module.exports.getXssFilteredObject(item);
      resolve(newItem);
    } else {
      const newItem = module.exports.getXssFilteredVar(item);
      resolve(newItem);
    }
  });
