const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = {
  // Generate JWT token
  generateToken: (userId) => {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Hash password
  hashPassword: async (password) => {
    return await bcrypt.hash(password, 10);
  },

  // Compare password
  comparePassword: async (password, hash) => {
    return await bcrypt.compare(password, hash);
  },

  // Generate random string
  generateRandomString: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },

  // Format date
  formatDate: (date, format = 'YYYY-MM-DD') => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');

    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      case 'DD/MM/YYYY':
        return `${day}/${month}/${year}`;
      case 'YYYY-MM-DD HH:mm':
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      default:
        return d.toISOString();
    }
  },

  // Calculate age from birth date
  calculateAge: (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  },

  // Format phone number for Botswana
  formatPhoneNumber: (phone) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Check if it's a Botswana number
    if (cleaned.length === 8) {
      return `+267${cleaned}`;
    } else if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return `+267${cleaned.substring(1)}`;
    } else if (cleaned.length === 12 && cleaned.startsWith('267')) {
      return `+${cleaned}`;
    }
    
    return phone;
  },

  // Validate email
  isValidEmail: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate phone number (Botswana)
  isValidPhoneNumber: (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 8 || (cleaned.length === 10 && cleaned.startsWith('0'));
  },

  // Parse pagination parameters
  parsePagination: (page, limit) => {
    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 20;
    const offset = (parsedPage - 1) * parsedLimit;
    
    return {
      page: parsedPage,
      limit: parsedLimit,
      offset,
      maxLimit: 100
    };
  },

  // Build where clause for search
  buildSearchWhere: (query, fields) => {
    if (!query) return {};
    
    return {
      [Op.or]: fields.map(field => ({
        [field]: { [Op.iLike]: `%${query}%` }
      }))
    };
  },

  // Sanitize object (remove null/undefined)
  sanitizeObject: (obj) => {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null)
    );
  },

  // Deep clone object
  deepClone: (obj) => {
    return JSON.parse(JSON.stringify(obj));
  },

  // Group array by key
  groupBy: (array, key) => {
    return array.reduce((result, item) => {
      const groupKey = item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  },

  // Calculate percentage
  calculatePercentage: (value, total) => {
    if (total === 0) return 0;
    return (value / total) * 100;
  },

  // Generate unique ID
  generateId: (prefix = '') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}${random}`;
  },

  // Sleep function
  sleep: (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  // Retry function with exponential backoff
  retry: async (fn, maxRetries = 3, baseDelay = 1000) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        const delay = baseDelay * Math.pow(2, i);
        await module.exports.sleep(delay);
      }
    }
    
    throw lastError;
  },

  // Format currency (BWP)
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-BW', {
      style: 'currency',
      currency: 'BWP'
    }).format(amount);
  },

  // Truncate text
  truncateText: (text, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Extract file extension
  getFileExtension: (filename) => {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  },

  // Generate filename for uploads
  generateFilename: (originalname) => {
    const ext = module.exports.getFileExtension(originalname);
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString('hex');
    return `${timestamp}-${random}.${ext}`;
  },

  // Check if string is JSON
  isJSON: (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  },

  // Merge objects deeply
  deepMerge: (target, source) => {
    const output = { ...target };
    
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        output[key] = module.exports.deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    
    return output;
  }
};