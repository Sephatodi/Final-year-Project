import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        setUser({ ...storedUser, token });
      } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://backend-production-a7388.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (response.ok) {
        // Store token and user data - use backend response data
        const userData = {
          userId: data.user?.id || data.userId,
          email: data.user?.email || email,
          name: data.user?.name,
          role: data.user?.role || data.role,
          phone: data.user?.phone,
          farmName: data.user?.farmName
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser({ 
          token: data.token,
          ...userData
        });
        console.log('User logged in:', userData);
        return { success: true };
      }
      return { success: false, error: data.message || 'Login failed' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch('https://backend-production-a7388.up.railway.app/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Register response:', data);
      
      if (response.ok) {
        const userData = {
          userId: data.user?.id || data.userId,
          email: data.user?.email || formData.email,
          name: data.user?.name,
          role: data.user?.role || formData.role || 'farmer',
          phone: data.user?.phone,
          farmName: data.user?.farmName
        };
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser({ 
          token: data.token,
          ...userData
        });
        console.log('User registered:', userData);
        return { success: true };
      }
      return { success: false, error: data.message || data.error || 'Registration failed' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'Network error. Please ensure the backend is running.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);