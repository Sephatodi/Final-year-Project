// Livestock API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://final-year-project-s9va.onrender.com/api';

const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Retrieved token from localStorage:', token ? token.substring(0, 20) + '...' : 'NO TOKEN FOUND');
  return token;
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
};

export const livestockApi = {
  // Get all livestock for current user (farmer)
  getLivestock: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.species) params.append('species', filters.species.toLowerCase());
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    
    const response = await makeRequest(`/livestock?${params.toString()}`);
    // Response has structure: { success: true, data: [...], pagination: {...} }
    return response.data || response || [];
  },
  
  // Get single livestock by ID
  getLivestockById: async (id) => {
    return makeRequest(`/livestock/${id}`);
  },
  
  // Create new livestock record
  createLivestock: async (data) => {
    const payload = {
      tagId: data.tagId,
      name: data.name,
      species: data.species.toLowerCase(),
      breed: data.breed,
      gender: data.gender,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
      acquisitionDate: data.acquisitionDate ? new Date(data.acquisitionDate).toISOString() : new Date().toISOString(),
      acquisitionMethod: data.acquisitionMethod || 'born',
    };
    console.log('Livestock payload:', payload);
    const response = await makeRequest('/livestock', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data || response;
  },
  
  // Update livestock record
  updateLivestock: async (id, data) => {
    return makeRequest(`/livestock/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  // Delete livestock
  deleteLivestock: async (id) => {
    return makeRequest(`/livestock/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Log health event for livestock
  logHealthEvent: async (id, eventData) => {
    return makeRequest(`/livestock/${id}/health-events`, {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },
  
  // Get health history for livestock
  getHealthHistory: async (id) => {
    return makeRequest(`/livestock/${id}/health-events`);
  },
  
  // Upload livestock image
  uploadImage: async (id, file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/livestock/${id}/images`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    return response.json();
  },
  
  // Get herd statistics (for dashboard)
  getHerdStats: async () => {
    return makeRequest('/livestock/stats');
  },
};

export default livestockApi;
