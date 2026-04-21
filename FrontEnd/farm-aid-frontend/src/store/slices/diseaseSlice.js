import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import diseaseReportService from '../../services/diseaseReportService';

export const fetchReports = createAsyncThunk(
  'disease/fetchReports',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await diseaseReportService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reports');
    }
  }
);

export const submitReport = createAsyncThunk(
  'disease/submitReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await diseaseReportService.create(reportData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to submit report');
    }
  }
);

export const updateReportStatus = createAsyncThunk(
  'disease/updateStatus',
  async ({ id, status, response }, { rejectWithValue }) => {
    try {
      const result = await diseaseReportService.updateStatus(id, status, response);
      return { id, status, response, ...result };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update status');
    }
  }
);

export const checkSymptoms = createAsyncThunk(
  'disease/checkSymptoms',
  async ({ species, symptoms, photos }, { rejectWithValue }) => {
    try {
      const response = await diseaseReportService.checkSymptoms({ species, symptoms, photos });
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Symptom check failed');
    }
  }
);

export const fetchZones = createAsyncThunk(
  'disease/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await diseaseReportService.getZones();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch zones');
    }
  }
);

const initialState = {
  reports: [],
  selectedReport: null,
  zones: [],
  symptomResults: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    priority: 'all',
    dateRange: 'all',
  },
};

const diseaseSlice = createSlice({
  name: 'disease',
  initialState,
  reducers: {
    setSelectedReport: (state, action) => {
      state.selectedReport = action.payload;
    },
    clearSelectedReport: (state) => {
      state.selectedReport = null;
    },
    clearSymptomResults: (state) => {
      state.symptomResults = null;
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
      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.reports || action.payload;
        state.stats = action.payload.stats || null;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Submit Report
      .addCase(submitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.reports.unshift(action.payload);
      })
      .addCase(submitReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Report Status
      .addCase(updateReportStatus.fulfilled, (state, action) => {
        const index = state.reports.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = {
            ...state.reports[index],
            status: action.payload.status,
            response: action.payload.response,
          };
        }
        if (state.selectedReport?.id === action.payload.id) {
          state.selectedReport = {
            ...state.selectedReport,
            status: action.payload.status,
            response: action.payload.response,
          };
        }
      })
      
      // Check Symptoms
      .addCase(checkSymptoms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSymptoms.fulfilled, (state, action) => {
        state.loading = false;
        state.symptomResults = action.payload;
      })
      .addCase(checkSymptoms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Zones
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones = action.payload;
      });
  },
});

export const {
  setSelectedReport,
  clearSelectedReport,
  clearSymptomResults,
  setFilters,
  clearError,
} = diseaseSlice.actions;

export default diseaseSlice.reducer;
