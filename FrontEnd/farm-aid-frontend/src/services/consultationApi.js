// Consultation API Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-production-a7388.up.railway.app/api';

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

export const consultationApi = {
  // Get all consultations for current user (farmer gets their own, vet gets assigned)
  getConsultations: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    return makeRequest(`/consultations?${params.toString()}`);
  },
  
  // Get single consultation by ID
  getConsultationById: async (id) => {
    return makeRequest(`/consultations/${id}`);
  },
  
  // Create new consultation (farmer only)
  createConsultation: async (data) => {
    return makeRequest('/consultations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Accept/Assign consultation (vet only)
  acceptConsultation: async (id) => {
    return makeRequest(`/consultations/${id}/accept`, {
      method: 'PUT',
    });
  },
  
  // Send message in consultation
  sendMessage: async (consultationId, message) => {
    return makeRequest(`/consultations/${consultationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content: message }),
    });
  },
  
  // Get messages for consultation
  getMessages: async (consultationId) => {
    return makeRequest(`/consultations/${consultationId}/messages`);
  },
  
  // Submit diagnosis (vet only)
  submitDiagnosis: async (consultationId, diagnosis) => {
    return makeRequest(`/consultations/${consultationId}/diagnosis`, {
      method: 'POST',
      body: JSON.stringify(diagnosis),
    });
  },
  
  // Get livestock list (for creating consultation)
  getLivestock: async () => {
    return makeRequest('/livestock');
  },
  
  // Upload consultation image
  uploadImage: async (consultationId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/images`, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload image');
    }
    
    return response.json();
  },
};

export default consultationApi;
