// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

// Deep merge objects
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key]) && isObject(target[key])) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
  }
  
  return output;
};

// Check if value is object (not array, not null)
export const isObject = (value) => {
  return value && typeof value === 'object' && !Array.isArray(value);
};

// Check if object is empty
export const isEmpty = (obj) => {
  return obj && Object.keys(obj).length === 0;
};

// Pick specific keys from object
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

// Omit specific keys from object
export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

// Get nested property safely
export const get = (obj, path, defaultValue = undefined) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined || !result.hasOwnProperty(key)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

// Set nested property
export const set = (obj, path, value) => {
  const keys = Array.isArray(path) ? path : path.split('.');
  const lastKey = keys.pop();
  
  let target = obj;
  for (const key of keys) {
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = {};
    }
    target = target[key];
  }
  
  target[lastKey] = value;
  return obj;
};

// Flatten object (convert nested to dot notation)
export const flatten = (obj, prefix = '') => {
  let result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const propName = prefix ? `${prefix}.${key}` : key;
      
      if (isObject(obj[key])) {
        result = { ...result, ...flatten(obj[key], propName) };
      } else {
        result[propName] = obj[key];
      }
    }
  }
  
  return result;
};

// Unflatten object (convert dot notation to nested)
export const unflatten = (obj) => {
  const result = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const keys = key.split('.');
      let target = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i];
        if (!target[k]) target[k] = {};
        target = target[k];
      }
      
      target[keys[keys.length - 1]] = obj[key];
    }
  }
  
  return result;
};

// Compare two objects (shallow)
export const shallowEqual = (objA, objB) => {
  if (objA === objB) return true;
  
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  return keysA.every(key => objA[key] === objB[key]);
};

// Compare two objects (deep)
export const deepEqual = (objA, objB) => {
  if (objA === objB) return true;
  
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }
  
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  
  if (keysA.length !== keysB.length) return false;
  
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  
  return true;
};

// Map object to array
export const mapToArray = (obj, keyName = 'key', valueName = 'value') => {
  return Object.entries(obj).map(([key, value]) => ({
    [keyName]: key,
    [valueName]: value,
  }));
};

// Map array to object
export const arrayToMap = (array, keyName = 'id', valueName = null) => {
  return array.reduce((obj, item) => {
    const key = item[keyName];
    obj[key] = valueName ? item[valueName] : item;
    return obj;
  }, {});
};

// Invert object (swap keys and values)
export const invert = (obj) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[value] = key;
    return result;
  }, {});
};

// Filter object by predicate
export const filter = (obj, predicate) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (predicate(value, key)) {
      result[key] = value;
    }
    return result;
  }, {});
};

// Map object values
export const mapValues = (obj, fn) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[key] = fn(value, key);
    return result;
  }, {});
};

// Map object keys
export const mapKeys = (obj, fn) => {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[fn(key, value)] = value;
    return result;
  }, {});
};

// Sort object keys
export const sortKeys = (obj) => {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach(key => {
      sorted[key] = obj[key];
    });
  return sorted;
};

// Freeze object deeply
export const deepFreeze = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  Object.freeze(obj);
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      deepFreeze(obj[key]);
    }
  }
  
  return obj;
};