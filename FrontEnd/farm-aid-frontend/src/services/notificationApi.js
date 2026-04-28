// Notification API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://final-year-project-s9va.onrender.com/api';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const makeRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      let errorMessage = `API Error: ${response.status}`;
      try {
        const errorData = await response.json();
        // Extract error message from various possible formats
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors
            .map(e => e.msg || e.message || JSON.stringify(e))
            .join(', ');
        }
      } catch (parseError) {
        // Response wasn't JSON, keep default error message
      }
      console.error('API Error Details:', { endpoint, status: response.status, errorMessage });
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(String(error));
  }
  
  return response.json();
};

const notificationApi = {
  // Get all notifications for current user
  getNotifications: async (filter = 'all', limit = 50, offset = 0) => {
    try {
      const response = await makeRequest(
        `/notifications?filter=${filter}&limit=${limit}&offset=${offset}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await makeRequest('/notifications/unread/count');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await makeRequest(
        `/notifications/${notificationId}/read`,
        { method: 'PUT' }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await makeRequest(
        '/notifications/read/all',
        { method: 'PUT' }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Archive notification
  archiveNotification: async (notificationId) => {
    try {
      const response = await makeRequest(
        `/notifications/${notificationId}/archive`,
        { method: 'PUT' }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await makeRequest(
        `/notifications/${notificationId}`,
        { method: 'DELETE' }
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export default notificationApi;
