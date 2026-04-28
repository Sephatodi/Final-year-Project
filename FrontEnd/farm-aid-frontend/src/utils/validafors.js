import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

// Phone number validation (Botswana format)
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  // Botswana: 8 digits local, or 11 digits with country code
  return cleaned.length === 8 || (cleaned.length === 11 && cleaned.startsWith('267'));
};

// Email validation
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// BAITS tag validation
export const isValidBaitsTag = (tag) => {
  const pattern = /^BW-\d{4}-[A-Z0-9]{5,10}$/;
  return pattern.test(tag);
};

// Password strength validation
export const isStrongPassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers,
    strength: [minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecial].filter(Boolean).length,
    requirements: {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecial,
    },
  };
};

// Coordinates validation
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// Date validation
export const isValidDate = (date) => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

// Future date validation
export const isFutureDate = (date) => {
  const d = new Date(date);
  return isValidDate(date) && d > new Date();
};

// Past date validation
export const isPastDate = (date) => {
  const d = new Date(date);
  return isValidDate(date) && d < new Date();
};

// Age validation (between 0 and 30 years)
export const isValidAge = (age) => {
  const num = Number(age);
  return !isNaN(num) && num >= 0 && num <= 30;
};

// Weight validation (between 0 and 2000 kg)
export const isValidWeight = (weight) => {
  const num = Number(weight);
  return !isNaN(num) && num > 0 && num <= 2000;
};

// Animal count validation
export const isValidAnimalCount = (count) => {
  const num = Number(count);
  return Number.isInteger(num) && num > 0 && num <= 10000;
};

// File validation
export const isValidFile = (file, allowedTypes = ALLOWED_IMAGE_TYPES, maxSize = MAX_FILE_SIZE) => {
  const errors = [];

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  if (file.size > maxSize) {
    errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Required fields validation
export const validateRequired = (obj, fields) => {
  const errors = {};
  
  for (const field of fields) {
    if (!obj[field] || (typeof obj[field] === 'string' && !obj[field].trim())) {
      errors[field] = `${field} is required`;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Length validation
export const validateLength = (str, min, max, fieldName) => {
  const length = str?.length || 0;
  
  if (length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  
  if (length > max) {
    return `${fieldName} must be less than ${max} characters`;
  }
  
  return null;
};

// Number range validation
export const validateRange = (num, min, max, fieldName) => {
  const value = Number(num);
  
  if (isNaN(value)) {
    return `${fieldName} must be a number`;
  }
  
  if (value < min) {
    return `${fieldName} must be at least ${min}`;
  }
  
  if (value > max) {
    return `${fieldName} must be at most ${max}`;
  }
  
  return null;
};

// Array validation
export const validateArray = (arr, minLength = 0, maxLength = Infinity, fieldName) => {
  if (!Array.isArray(arr)) {
    return `${fieldName} must be an array`;
  }
  
  if (arr.length < minLength) {
    return `${fieldName} must have at least ${minLength} items`;
  }
  
  if (arr.length > maxLength) {
    return `${fieldName} must have at most ${maxLength} items`;
  }
  
  return null;
};

// Enum validation
export const validateEnum = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    return `${fieldName} must be one of: ${allowedValues.join(', ')}`;
  }
  return null;
};