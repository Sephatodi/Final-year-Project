import { applyMiddleware } from 'redux';
import logger from './logger';
import offlineMiddleware from './offlineMiddleware';
import syncMiddleware from './syncMiddleware';

// Export all middleware
import logger from './logger';
import offlineMiddleware from './offlineMiddleware';
import syncMiddleware, { startBackgroundSync } from './syncMiddleware';

// Create middleware array based on environment
export const createMiddleware = () => {
  const middleware = [
    offlineMiddleware,
    syncMiddleware,
  ];

  // Add logger only in development
  if (process.env.NODE_ENV === 'development') {
    middleware.push(logger);
  }

  return middleware;
};

// Compose middleware for Redux store
export const composeMiddleware = () => {
  return applyMiddleware(...createMiddleware());
};

// Export all middleware as a single object
const middleware = {
  logger,
  offline: offlineMiddleware,
  sync: syncMiddleware,
  createMiddleware,
  composeMiddleware,
  startBackgroundSync,
};

export default middleware;