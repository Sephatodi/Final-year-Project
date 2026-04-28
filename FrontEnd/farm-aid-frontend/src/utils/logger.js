// Log levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

// Current log level (can be changed at runtime)
let currentLogLevel = process.env.NODE_ENV === 'production' ? LOG_LEVELS.INFO : LOG_LEVELS.DEBUG;

// Set log level
export const setLogLevel = (level) => {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level;
  }
};

// Check if log level is enabled
const isLevelEnabled = (level) => {
  const levels = Object.values(LOG_LEVELS);
  return levels.indexOf(level) >= levels.indexOf(currentLogLevel);
};

// Format log message
const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (data) {
    return {
      message: formatted,
      data,
    };
  }
  
  return formatted;
};

// Logger methods
export const logger = {
  debug: (message, data = null) => {
    if (isLevelEnabled(LOG_LEVELS.DEBUG)) {
      const formatted = formatMessage(LOG_LEVELS.DEBUG, message, data);
      if (data) {
        console.debug(formatted.message, formatted.data);
      } else {
        console.debug(formatted);
      }
    }
  },

  info: (message, data = null) => {
    if (isLevelEnabled(LOG_LEVELS.INFO)) {
      const formatted = formatMessage(LOG_LEVELS.INFO, message, data);
      if (data) {
        console.info(formatted.message, formatted.data);
      } else {
        console.info(formatted);
      }
    }
  },

  warn: (message, data = null) => {
    if (isLevelEnabled(LOG_LEVELS.WARN)) {
      const formatted = formatMessage(LOG_LEVELS.WARN, message, data);
      if (data) {
        console.warn(formatted.message, formatted.data);
      } else {
        console.warn(formatted);
      }
    }
  },

  error: (message, error = null, data = null) => {
    if (isLevelEnabled(LOG_LEVELS.ERROR)) {
      const formatted = formatMessage(LOG_LEVELS.ERROR, message, data);
      
      if (error) {
        console.error(formatted.message, {
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          data: formatted.data,
        });
      } else if (data) {
        console.error(formatted.message, formatted.data);
      } else {
        console.error(formatted);
      }
    }
  },

  // Log with custom level
  log: (level, message, data = null) => {
    if (Object.values(LOG_LEVELS).includes(level)) {
      if (isLevelEnabled(level)) {
        const formatted = formatMessage(level, message, data);
        if (data) {
          console.log(formatted.message, formatted.data);
        } else {
          console.log(formatted);
        }
      }
    } else {
      console.warn(`Invalid log level: ${level}`);
    }
  },

  // Group logs
  group: (label, collapsed = false) => {
    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
  },

  groupEnd: () => {
    console.groupEnd();
  },

  // Time tracking
  time: (label) => {
    console.time(label);
  },

  timeEnd: (label) => {
    console.timeEnd(label);
  },

  // Table format
  table: (data, columns) => {
    console.table(data, columns);
  },

  // Clear console
  clear: () => {
    console.clear();
  },

  // Trace
  trace: (message) => {
    console.trace(message);
  },

  // Count
  count: (label) => {
    console.count(label);
  },

  countReset: (label) => {
    console.countReset(label);
  },

  // Assert
  assert: (condition, message) => {
    console.assert(condition, message);
  },

  // Direction
  dir: (obj, options) => {
    console.dir(obj, options);
  },

  // dirxml
  dirxml: (obj) => {
    console.dirxml(obj);
  },
};

// Performance monitoring
export const performance = {
  marks: {},

  start: (label) => {
    performance.marks[label] = performance.now();
  },

  end: (label) => {
    const start = performance.marks[label];
    if (start) {
      const duration = performance.now() - start;
      logger.debug(`${label} took ${duration.toFixed(2)}ms`);
      delete performance.marks[label];
      return duration;
    }
    return null;
  },

  measure: (label, fn) => {
    const start = performance.now();
    const result = fn();
    const duration = performance.now() - start;
    logger.debug(`${label} took ${duration.toFixed(2)}ms`);
    return result;
  },

  async measureAsync(label, fn) {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    logger.debug(`${label} took ${duration.toFixed(2)}ms`);
    return result;
  },
};

// Export default logger
export default logger;