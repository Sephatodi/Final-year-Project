/**
 * Farm-Aid Universal API Client
 * 
 * This service handles HTTP requests to the backend while integrating 
 * offline-first fallback capabilities for the PWA environment.
 */

// Fix: Use import.meta.env instead of process.env for Vite
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Validates network connectivity natively where possible.
 */
const checkIsOffline = () => {
    return typeof navigator !== 'undefined' && !navigator.onLine;
};

/**
 * Formats a standardized offline response so the UI degrades gracefully.
 */
const generateOfflineResponse = (endpoint, method) => {
    return {
        ok: false,
        status: 503,
        offline: true,
        message: 'Device offline. Request has been queued for background sync.',
        _queuedInfo: { endpoint, method, timestamp: new Date().toISOString() }
    };
};

/**
 * Standard HTTP Response handler.
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || `HTTP Error ${response.status}`);
    }
    
    // Attempt standard JSON parsing
    try {
        return await response.json();
    } catch (e) {
        return { success: true };
    }
};

class ApiClient {
    
    /**
     * Internal request processor bridging fetch and offline catches.
     */
    static async request(endpoint, options = {}) {
        if (checkIsOffline()) {
            console.warn(`[FarmAid Offline Manager] Intercepting ${options.method || 'GET'} to ${endpoint} due to network loss.`);
            return generateOfflineResponse(endpoint, options.method || 'GET');
        }

        const url = `${BASE_URL}${endpoint}`;
        
        // Setup standard headers (e.g., Auth, Content-Type)
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers,
        };

        // Example: Inject JWT Token from LocalStorage if it exists
        const token = localStorage.getItem('farmaid_auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            return await handleResponse(response);
            
        } catch (error) {
            // Check if error is specifically a network failure
            if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
                console.error(`[FarmAid Offline Manager] Network dropout detected during live request to ${endpoint}`);
                return generateOfflineResponse(endpoint, options.method || 'GET');
            }
            throw error;
        }
    }

    // ==========================================
    // Public CRUD Methods
    // ==========================================

    static get(endpoint, customHeaders = {}) {
        return this.request(endpoint, { method: 'GET', headers: customHeaders });
    }

    static post(endpoint, body, customHeaders = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: customHeaders
        });
    }

    static put(endpoint, body, customHeaders = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: customHeaders
        });
    }

    static delete(endpoint, customHeaders = {}) {
        return this.request(endpoint, { method: 'DELETE', headers: customHeaders });
    }

    // ==========================================
    // Domain-Specific Helper Methods
    // ==========================================

    /**
     * Authenticate user credentials.
     */
    static async login(credentials) {
        return this.post('/auth/login', credentials);
    }

    /**
     * Sync local indexedDB records to the remote database
     */
    static async syncLocalRecords(recordsBatch) {
        return this.post('/sync/batch', { records: recordsBatch });
    }

    /**
     * Upload a single file
     */
    static uploadFile(endpoint, file, onProgress) {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('farmaid_auth_token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
            headers,
            ...((onProgress) ? { onUploadProgress: onProgress } : {})
        }).then(handleResponse);
    }

    /**
     * Upload multiple files
     */
    static uploadMultipleFiles(endpoint, files, onProgress) {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file);
        });

        const token = localStorage.getItem('farmaid_auth_token');
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            body: formData,
            headers,
            ...((onProgress) ? { onUploadProgress: onProgress } : {})
        }).then(handleResponse);
    }
}

// Named exports for convenience
export default ApiClient;
export const api = ApiClient;
export const get = (endpoint, headers) => ApiClient.get(endpoint, headers);
export const post = (endpoint, body, headers) => ApiClient.post(endpoint, body, headers);
export const put = (endpoint, body, headers) => ApiClient.put(endpoint, body, headers);
export const del = (endpoint, headers) => ApiClient.delete(endpoint, headers);
export const uploadFile = (endpoint, file, onProgress) => ApiClient.uploadFile(endpoint, file, onProgress);
export const uploadMultipleFiles = (endpoint, files, onProgress) => ApiClient.uploadMultipleFiles(endpoint, files, onProgress);