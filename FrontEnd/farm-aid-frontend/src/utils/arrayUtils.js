// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    
    result[groupKey].push(item);
    return result;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, direction = 'asc') => {
  const sorted = [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sorted;
};

// Filter array by search term
export const filterBySearch = (array, searchTerm, keys) => {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  
  return array.filter(item => {
    return keys.some(key => {
      const value = typeof key === 'function' ? key(item) : item[key];
      return String(value).toLowerCase().includes(term);
    });
  });
};

// Paginate array
export const paginate = (array, page, pageSize) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    items: array.slice(start, end),
    total: array.length,
    page,
    pageSize,
    totalPages: Math.ceil(array.length / pageSize),
    hasNext: end < array.length,
    hasPrev: page > 1,
  };
};

// Remove duplicates
export const unique = (array, key = null) => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

// Chunk array
export const chunk = (array, size) => {
  const chunks = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
};

// Flatten array
export const flatten = (array) => {
  return array.reduce((flat, item) => {
    return flat.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};

// Get intersection of arrays
export const intersection = (a, b) => {
  return a.filter(item => b.includes(item));
};

// Get difference of arrays
export const difference = (a, b) => {
  return a.filter(item => !b.includes(item));
};

// Get union of arrays
export const union = (a, b) => {
  return [...new Set([...a, ...b])];
};

// Shuffle array
export const shuffle = (array) => {
  const shuffled = [...array];
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
};

// Get random item from array
export const random = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Sum array values
export const sum = (array, key = null) => {
  return array.reduce((total, item) => {
    const value = key ? (typeof key === 'function' ? key(item) : item[key]) : item;
    return total + (Number(value) || 0);
  }, 0);
};

// Average array values
export const average = (array, key = null) => {
  if (array.length === 0) return 0;
  return sum(array, key) / array.length;
};

// Min value in array
export const min = (array, key = null) => {
  if (array.length === 0) return null;
  
  return array.reduce((min, item) => {
    const value = key ? (typeof key === 'function' ? key(item) : item[key]) : item;
    return value < min ? value : min;
  }, Infinity);
};

// Max value in array
export const max = (array, key = null) => {
  if (array.length === 0) return null;
  
  return array.reduce((max, item) => {
    const value = key ? (typeof key === 'function' ? key(item) : item[key]) : item;
    return value > max ? value : max;
  }, -Infinity);
};

// Count occurrences
export const countBy = (array, key) => {
  return array.reduce((counts, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
};

// Move item within array
export const move = (array, fromIndex, toIndex) => {
  const moved = [...array];
  const [item] = moved.splice(fromIndex, 1);
  moved.splice(toIndex, 0, item);
  return moved;
};

// Replace item in array
export const replace = (array, index, newItem) => {
  return [...array.slice(0, index), newItem, ...array.slice(index + 1)];
};

// Remove item from array
export const remove = (array, predicate) => {
  return array.filter((item, index) => !predicate(item, index));
};

// Toggle item in array (add if not present, remove if present)
export const toggle = (array, item, key = null) => {
  if (key) {
    const exists = array.some(i => i[key] === item[key]);
    if (exists) {
      return array.filter(i => i[key] !== item[key]);
    }
    return [...array, item];
  }
  
  if (array.includes(item)) {
    return array.filter(i => i !== item);
  }
  return [...array, item];
};