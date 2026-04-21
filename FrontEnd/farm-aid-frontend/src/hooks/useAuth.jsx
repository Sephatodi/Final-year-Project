import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone, password, rememberMe = false) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { phone, password });
      
      const { token, user } = response.data;
      
      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const offlineLogin = async (offlineUuid, pin) => {
    try {
      setError(null);
      const response = await api.post('/auth/offline-login', { offlineUuid, pin });
      
      const { token, user } = response.data;
      sessionStorage.setItem('token', token);
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Offline login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const biometricLogin = async () => {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      setError('Biometric authentication not supported');
      return { success: false, error: 'Not supported' };
    }

    try {
      // In production, implement WebAuthn
      const response = await api.post('/auth/biometric-login');
      
      const { token, user } = response.data;
      sessionStorage.setItem('token', token);
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Biometric login failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      setToken(token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setToken(null);
      setUser(null);
      navigate('/login');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      setUser(response.data);
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Update failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.post('/auth/change-password', { currentPassword, newPassword });
      return { success: true };
    } catch (error) {
      setError(error.response?.data?.error || 'Password change failed');
      return { success: false, error: error.response?.data?.error };
    }
  };

  const forgotPassword = {
    requestOTP: async (phone) => {
      try {
        await api.post('/auth/forgot-password', { phone });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error };
      }
    },
    verifyOTP: async (phone, otp) => {
      try {
        await api.post('/auth/verify-otp', { phone, otp });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error };
      }
    },
    resetPassword: async (phone, otp, newPassword) => {
      try {
        await api.post('/auth/reset-password', { phone, otp, newPassword });
        return { success: true };
      } catch (error) {
        return { success: false, error: error.response?.data?.error };
      }
    },
  };

  const enable2FA = async (code) => {
    try {
      await api.post('/auth/2fa/enable', { code });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const disable2FA = async () => {
    try {
      await api.post('/auth/2fa/disable');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const updateFarm = async (farmData) => {
    try {
      const response = await api.put('/users/farm', farmData);
      setUser(prev => ({ ...prev, farm: response.data }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    offlineLogin,
    biometricLogin,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    enable2FA,
    disable2FA,
    updateFarm,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
