import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import alertService from '../../services/alertService';

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await alertService.getActive(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch alerts');
    }
  }
);

export const dismissAlert = createAsyncThunk(
  'alerts/dismiss',
  async (id, { rejectWithValue }) => {
    try {
      await alertService.dismiss(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to dismiss alert');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'alerts/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      await alertService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark as read');
    }
  }
);

export const fetchZones = createAsyncThunk(
  'alerts/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertService.getZones();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch zones');
    }
  }
);

export const fetchRestrictions = createAsyncThunk(
  'alerts/fetchRestrictions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await alertService.getMovementRestrictions();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch restrictions');
    }
  }
);

const initialState = {
  alerts: [],
  zones: [],
  restrictions: [],
  loading: false,
  error: null,
  unreadCount: 0,
  filters: {
    type: 'all',
    severity: 'all',
  },
};

const alertSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount++;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
        state.unreadCount = action.payload.filter(a => !a.read).length;
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Dismiss Alert
      .addCase(dismissAlert.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload);
        if (alert && !alert.read) {
          state.unreadCount--;
        }
        state.alerts = state.alerts.filter(a => a.id !== action.payload);
      })
      
      // Mark as Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const alert = state.alerts.find(a => a.id === action.payload);
        if (alert && !alert.read) {
          alert.read = true;
          state.unreadCount--;
        }
      })
      
      // Fetch Zones
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload;
      })
      
      // Fetch Restrictions
      .addCase(fetchRestrictions.fulfilled, (state, action) => {
        state.restrictions = action.payload;
      });
  },
});

export const { addAlert, setFilters, clearError } = alertSlice.actions;

export default alertSlice.reducer;
