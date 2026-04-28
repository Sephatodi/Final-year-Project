// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalize each word
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Truncate string with ellipsis
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

// Slugify string
export const slugify = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Generate random string
export const randomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Generate random number string
export const randomNumber = (length = 6) => {
  const chars = '0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Remove HTML tags
export const stripHtml = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

// Escape HTML
export const escapeHtml = (str) => {
  const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return str.replace(/[&<>"']/g, match => replacements[match]);
};

// Unescape HTML
export const unescapeHtml = (str) => {
  const replacements = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };
  
  return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, match => replacements[match]);
};

// Check if string contains only letters
export const isAlpha = (str) => {
  return /^[a-zA-Z]+$/.test(str);
};

// Check if string contains only numbers
export const isNumeric = (str) => {
  return /^\d+$/.test(str);
};

// Check if string contains only alphanumeric
export const isAlphanumeric = (str) => {
  return /^[a-zA-Z0-9]+$/.test(str);
};

// Pad string to left
export const padLeft = (str, length, char = ' ') => {
  str = String(str);
  while (str.length < length) {
    str = char + str;
  }
  return str;
};

// Pad string to right
export const padRight = (str, length, char = ' ') => {
  str = String(str);
  while (str.length < length) {
    str += char;
  }
  return str;
};

// Reverse string
export const reverse = (str) => {
  return str.split('').reverse().join('');
};

// Count words
export const wordCount = (str) => {
  return str.trim().split(/\s+/).length;
};

// Count characters (excluding spaces)
export const charCount = (str) => {
  return str.replace(/\s/g, '').length;
};

// Extract mentions (@username)
export const extractMentions = (str) => {
  const regex = /@(\w+)/g;
  const matches = str.match(regex);
  return matches ? matches.map(m => m.slice(1)) : [];
};

// Extract hashtags (#tag)
export const extractHashtags = (str) => {
  const regex = /#(\w+)/g;
  const matches = str.match(regex);
  return matches ? matches.map(m => m.slice(1)) : [];
};

// Convert to camelCase
export const toCamelCase = (str) => {
  return str
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, c => c.toLowerCase());
};

// Convert to snake_case
export const toSnakeCase = (str) => {
  return str
    .replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    .replace(/^_/, '')
    .replace(/[-_\s]+/g, '_');
};

// Convert to kebab-case
export const toKebabCase = (str) => {
  return str
    .replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    .replace(/^_/, '')
    .replace(/[-_\s]+/g, '-');
};

// Mask string (e.g., for credit cards)
export const mask = (str, visibleChars = 4, maskChar = '*') => {
  if (!str) return '';
  if (str.length <= visibleChars) return str;
  
  const maskedLength = str.length - visibleChars;
  const masked = maskChar.repeat(maskedLength);
  const visible = str.slice(-visibleChars);
  
  return masked + visible;
};

// Pluralize word
export const pluralize = (count, singular, plural = null) => {
  if (count === 1) return singular;
  return plural || singular + 's';
};