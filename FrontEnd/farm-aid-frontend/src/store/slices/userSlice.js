import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Profile update failed');
    }
  }
);

export const changePassword = createAsyncThunk(
  'user/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(currentPassword, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Password change failed');
    }
  }
);

export const updateFarmDetails = createAsyncThunk(
  'user/updateFarmDetails',
  async (farmData, { rejectWithValue }) => {
    try {
      const response = await authService.updateFarmDetails(farmData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Farm update failed');
    }
  }
);

export const getSessions = createAsyncThunk(
  'user/getSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getSessions();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to get sessions');
    }
  }
);

export const terminateSession = createAsyncThunk(
  'user/terminateSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await authService.terminateSession(sessionId);
      return { sessionId, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to terminate session');
    }
  }
);

const initialState = {
  profile: null,
  farm: null,
  sessions: [],
  loading: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.successMessage = 'Password changed successfully';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Farm Details
      .addCase(updateFarmDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFarmDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.farm = action.payload;
        state.successMessage = 'Farm details updated successfully';
      })
      .addCase(updateFarmDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get Sessions
      .addCase(getSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Terminate Session
      .addCase(terminateSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s.id !== action.payload.sessionId);
        state.successMessage = 'Session terminated successfully';
      });
  },
});

export const { clearError, clearSuccess, setProfile } = userSlice.actions;

export default userSlice.reducer;