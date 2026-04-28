/**
 * Simple logger implementation - no external dependencies
 * Provides basic logging without Winston
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

const LOG_LEVEL_PRIORITY = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

const currentLogLevel = process.env.LOG_LEVEL || 'INFO';

const formatTimestamp = () => {
  const now = new Date().toISOString();
  return now;
};

const shouldLog = (level) => {
  return LOG_LEVEL_PRIORITY[level] <= LOG_LEVEL_PRIORITY[currentLogLevel];
};

const log = (level, message, meta = {}) => {
  if (!shouldLog(level)) return;

  const timestamp = formatTimestamp();
  const metaStr = Object.keys(meta).length > 0 ? ' ' + JSON.stringify(meta) : '';
  const output = `${timestamp} [${level}]: ${message}${metaStr}`;

  if (level === 'ERROR') {
    console.error(output);
  } else if (level === 'WARN') {
    console.warn(output);
  } else {
    console.log(output);
  }
};

const logger = {
  error: (message, meta) => log(LOG_LEVELS.ERROR, message, meta),
  warn: (message, meta) => log(LOG_LEVELS.WARN, message, meta),
  info: (message, meta) => log(LOG_LEVELS.INFO, message, meta),
  debug: (message, meta) => log(LOG_LEVELS.DEBUG, message, meta),
  
  // Stream for Morgan integration
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
};

module.exports = logger;