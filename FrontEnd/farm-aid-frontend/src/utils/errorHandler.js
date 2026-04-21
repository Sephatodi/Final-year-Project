import { ERROR_MESSAGES, HTTP_STATUS } from './constants';

// Main error handler
export const handleError = (error, context = '') => {
  console.error(`Error in ${context}:`, error);

  // Network error
  if (!navigator.onLine) {
    return {
      message: ERROR_MESSAGES.NETWORK_ERROR,
      type: 'offline',
      retry: true,
    };
  }

  // Axios error
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        return {
          message: data.message || ERROR_MESSAGES.UNAUTHORIZED,
          type: 'auth',
          action: 'logout',
        };

      case HTTP_STATUS.FORBIDDEN:
        return {
          message: data.message || ERROR_MESSAGES.FORBIDDEN,
          type: 'permission',
        };

      case HTTP_STATUS.NOT_FOUND:
        return {
          message: data.message || ERROR_MESSAGES.NOT_FOUND,
          type: 'not_found',
        };

      case HTTP_STATUS.CONFLICT:
        return {
          message: data.message || 'Conflict detected',
          type: 'conflict',
          details: data.details,
        };

      case HTTP_STATUS.BAD_REQUEST:
        return {
          message: data.message || ERROR_MESSAGES.VALIDATION_ERROR,
          type: 'validation',
          errors: data.errors,
        };

      case HTTP_STATUS.SERVER_ERROR:
        return {
          message: data.message || ERROR_MESSAGES.SERVER_ERROR,
          type: 'server',
          retry: true,
        };

      default:
        return {
          message: data.message || 'An error occurred',
          type: 'unknown',
        };
    }
  }

  // Request made but no response
  if (error.request) {
    return {
      message: 'No response from server',
      type: 'connection',
      retry: true,
    };
  }

  // Something else
  return {
    message: error.message || 'An unexpected error occurred',
    type: 'unknown',
  };
};

// Create user-friendly error message
export const getUserFriendlyMessage = (error) => {
  const handled = handleError(error);
  
  switch (handled.type) {
    case 'offline':
      return 'You are offline. Please check your internet connection.';
      
    case 'auth':
      return 'Your session has expired. Please log in again.';
      
    case 'permission':
      return 'You do not have permission to perform this action.';
      
    case 'not_found':
      return 'The requested resource was not found.';
      
    case 'validation':
      return 'Please check your input and try again.';
      
    case 'server':
      return 'Server error. Please try again later.';
      
    case 'connection':
      return 'Unable to connect to server. Please check your connection.';
      
    default:
      return handled.message || 'An error occurred. Please try again.';
  }
};

// Log error to monitoring service
export const logError = (error, context, user = null) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    user: user?.id,
    url: window.location.href,
    userAgent: navigator.userAgent,
  };

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Send to Sentry, LogRocket, etc.
    console.error('Error logged:', errorLog);
  } else {
    console.error('Development error log:', errorLog);
  }
};

// Create error boundary fallback
export const createErrorFallback = (error, resetError) => {
  const handled = handleError(error);
  
  return {
    title: 'Something went wrong',
    message: getUserFriendlyMessage(error),
    action: handled.retry ? resetError : null,
    actionLabel: handled.retry ? 'Try Again' : null,
  };
};

// Handle API error response
export const handleApiError = (error, defaultMessage = 'Request failed') => {
  if (error.response?.data) {
    return {
      message: error.response.data.message || defaultMessage,
      errors: error.response.data.errors,
      status: error.response.status,
    };
  }
  
  return {
    message: error.message || defaultMessage,
    errors: [],
    status: null,
  };
};

// Create validation error object
export const createValidationError = (errors) => {
  return {
    type: 'validation',
    message: 'Validation failed',
    errors,
  };
};

// Check if error is retryable
export const isRetryable = (error) => {
  const handled = handleError(error);
  return handled.retry === true;
};

// Get error status code
export const getErrorStatusCode = (error) => {
  return error.response?.status || null;
};

// Get error response data
export const getErrorData = (error) => {
  return error.response?.data || null;
};

// Format validation errors for display
export const formatValidationErrors = (errors) => {
  if (Array.isArray(errors)) {
    return errors.map(e => e.message || e).join(', ');
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors).join(', ');
  }
  
  return String(errors);
};

// Create error notification object
export const createErrorNotification = (error, title = 'Error') => {
  return {
    type: 'error',
    title,
    message: getUserFriendlyMessage(error),
    duration: 5000,
  };
};