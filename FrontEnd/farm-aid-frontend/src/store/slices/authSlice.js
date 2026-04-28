import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ phone, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authService.login(phone, password);
      return { ...response, rememberMe };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Login failed');
    }
  }
);

export const offlineLogin = createAsyncThunk(
  'auth/offlineLogin',
  async ({ offlineUuid, pin }, { rejectWithValue }) => {
    try {
      const response = await authService.offlineLogin(offlineUuid, pin);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Offline login failed');
    }
  }
);

export const biometricLogin = createAsyncThunk(
  'auth/biometricLogin',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.biometricLogin();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Biometric login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Token refresh failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get user');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.rememberMe = action.payload.rememberMe;
        
        if (action.payload.rememberMe) {
          localStorage.setItem('token', action.payload.token);
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
        } else {
          sessionStorage.setItem('token', action.payload.token);
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Offline Login
      .addCase(offlineLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(offlineLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem('token', action.payload.token);
      })
      .addCase(offlineLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Biometric Login
      .addCase(biometricLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(biometricLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        sessionStorage.setItem('token', action.payload.token);
      })
      .addCase(biometricLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.rememberMe = false;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { clearError, setToken } = authSlice.actions;

export default authSlice.reducer;
