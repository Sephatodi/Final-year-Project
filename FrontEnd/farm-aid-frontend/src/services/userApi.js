// User Management API Service
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `API Error: ${response.status}`);
  }
  
  return response.json();
};

export const userApi = {
  /**
   * Get all farmers
   * @param {Object} filters - Filter options (status, location, etc.)
   * @returns {Promise} List of farmers
   */
  getFarmers: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.location) params.append('location', filters.location);
    if (filters.search) params.append('search', filters.search);
    
    return makeRequest(`/users/farmers?${params.toString()}`);
  },

  /**
   * Get all veterinarians
   * @param {Object} filters - Filter options (status, specialization, etc.)
   * @returns {Promise} List of veterinarians
   */
  getVeterinarians: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.specialization) params.append('specialization', filters.specialization);
    if (filters.search) params.append('search', filters.search);
    
    return makeRequest(`/users/veterinarians?${params.toString()}`);
  },

  /**
   * Get single farmer by ID
   * @param {string} id - Farmer ID
   * @returns {Promise} Farmer details
   */
  getFarmerById: async (id) => {
    return makeRequest(`/users/farmers/${id}`);
  },

  /**
   * Get single veterinarian by ID
   * @param {string} id - Veterinarian ID
   * @returns {Promise} Veterinarian details
   */
  getVeterinarianById: async (id) => {
    return makeRequest(`/users/veterinarians/${id}`);
  },

  /**
   * Add new farmer (Admin only)
   * @param {Object} data - Farmer data
   * @returns {Promise} Created farmer
   */
  addFarmer: async (data) => {
    return makeRequest('/users/farmers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Add new veterinarian (Admin only)
   * @param {Object} data - Veterinarian data
   * @returns {Promise} Created veterinarian
   */
  addVeterinarian: async (data) => {
    return makeRequest('/users/veterinarians', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update farmer (Admin only)
   * @param {string} id - Farmer ID
   * @param {Object} data - Updated farmer data
   * @returns {Promise} Updated farmer
   */
  updateFarmer: async (id, data) => {
    return makeRequest(`/users/farmers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update veterinarian (Admin only)
   * @param {string} id - Veterinarian ID
   * @param {Object} data - Updated veterinarian data
   * @returns {Promise} Updated veterinarian
   */
  updateVeterinarian: async (id, data) => {
    return makeRequest(`/users/veterinarians/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete farmer (Admin only)
   * @param {string} id - Farmer ID
   * @returns {Promise} Deletion confirmation
   */
  deleteFarmer: async (id) => {
    return makeRequest(`/users/farmers/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Delete veterinarian (Admin only)
   * @param {string} id - Veterinarian ID
   * @returns {Promise} Deletion confirmation
   */
  deleteVeterinarian: async (id) => {
    return makeRequest(`/users/veterinarians/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Activate/Deactivate farmer
   * @param {string} id - Farmer ID
   * @param {string} status - 'active' or 'inactive'
   * @returns {Promise} Updated farmer
   */
  updateFarmerStatus: async (id, status) => {
    return makeRequest(`/users/farmers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Activate/Deactivate veterinarian
   * @param {string} id - Veterinarian ID
   * @param {string} status - 'active' or 'inactive'
   * @returns {Promise} Updated veterinarian
   */
  updateVeterinarianStatus: async (id, status) => {
    return makeRequest(`/users/veterinarians/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Verify farmer email
   * @param {string} id - Farmer ID
   * @returns {Promise} Verification confirmation
   */
  verifyFarmerEmail: async (id) => {
    return makeRequest(`/users/farmers/${id}/verify-email`, {
      method: 'POST',
    });
  },

  /**
   * Verify veterinarian license
   * @param {string} id - Veterinarian ID
   * @param {Object} data - License verification data
   * @returns {Promise} Verification confirmation
   */
  verifyVeterinarianLicense: async (id, data) => {
    return makeRequest(`/users/veterinarians/${id}/verify-license`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get user statistics
   * @returns {Promise} User stats (total, active, inactive, etc.)
   */
  getUserStats: async () => {
    return makeRequest('/users/stats');
  },

  /**
   * Batch delete users
   * @param {Array} userIds - Array of user IDs to delete
   * @param {string} userType - 'farmers' or 'veterinarians'
   * @returns {Promise} Deletion confirmation
   */
  batchDeleteUsers: async (userIds, userType) => {
    return makeRequest(`/users/${userType}/batch-delete`, {
      method: 'DELETE',
      body: JSON.stringify({ ids: userIds }),
    });
  },

  /**
   * Export users to CSV
   * @param {string} userType - 'farmers' or 'veterinarians'
   * @param {Object} filters - Export filters
   * @returns {Promise} CSV file URL or data
   */
  exportUsers: async (userType, filters = {}) => {
    const params = new URLSearchParams({ ...filters });
    return makeRequest(`/users/${userType}/export?${params.toString()}`);
  },

  /**
   * Import users from CSV
   * @param {File} file - CSV file to import
   * @param {string} userType - 'farmers' or 'veterinarians'
   * @returns {Promise} Import results
   */
  importUsers: async (file, userType) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/users/${userType}/import`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Import failed: ${response.status}`);
    }

    return response.json();
  },
};

export default userApi;
