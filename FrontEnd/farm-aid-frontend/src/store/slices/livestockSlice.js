import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import livestockService from '../../services/livestockService';

export const fetchLivestock = createAsyncThunk(
  'livestock/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await livestockService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch livestock');
    }
  }
);

export const addLivestock = createAsyncThunk(
  'livestock/add',
  async (animalData, { rejectWithValue }) => {
    try {
      const response = await livestockService.create(animalData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add animal');
    }
  }
);

export const updateLivestock = createAsyncThunk(
  'livestock/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await livestockService.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update animal');
    }
  }
);

export const deleteLivestock = createAsyncThunk(
  'livestock/delete',
  async (id, { rejectWithValue }) => {
    try {
      await livestockService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete animal');
    }
  }
);

export const fetchHealthRecords = createAsyncThunk(
  'livestock/fetchHealthRecords',
  async (livestockId, { rejectWithValue }) => {
    try {
      const response = await livestockService.getHealthRecords(livestockId);
      return { livestockId, records: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch health records');
    }
  }
);

export const addHealthRecord = createAsyncThunk(
  'livestock/addHealthRecord',
  async ({ livestockId, data }, { rejectWithValue }) => {
    try {
      const response = await livestockService.addHealthRecord(livestockId, data);
      return { livestockId, record: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add health record');
    }
  }
);

export const fetchLivestockStats = createAsyncThunk(
  'livestock/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await livestockService.getStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  animals: [],
  selectedAnimal: null,
  healthRecords: {},
  stats: null,
  loading: false,
  error: null,
  totalCount: 0,
  filters: {
    species: 'all',
    status: 'all',
    search: '',
  },
  pagination: {
    page: 1,
    limit: 20,
  },
};

const livestockSlice = createSlice({
  name: 'livestock',
  initialState,
  reducers: {
    setSelectedAnimal: (state, action) => {
      state.selectedAnimal = action.payload;
    },
    clearSelectedAnimal: (state) => {
      state.selectedAnimal = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Livestock
      .addCase(fetchLivestock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = action.payload.animals || action.payload;
        state.totalCount = action.payload.total || action.payload.length;
      })
      .addCase(fetchLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Livestock
      .addCase(addLivestock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.animals.unshift(action.payload);
        state.totalCount++;
      })
      .addCase(addLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Livestock
      .addCase(updateLivestock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLivestock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.animals.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.animals[index] = action.payload;
        }
        if (state.selectedAnimal?.id === action.payload.id) {
          state.selectedAnimal = action.payload;
        }
      })
      .addCase(updateLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete Livestock
      .addCase(deleteLivestock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.animals = state.animals.filter(a => a.id !== action.payload);
        state.totalCount--;
        if (state.selectedAnimal?.id === action.payload) {
          state.selectedAnimal = null;
        }
      })
      .addCase(deleteLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Health Records
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.healthRecords[action.payload.livestockId] = action.payload.records;
      })
      
      // Add Health Record
      .addCase(addHealthRecord.fulfilled, (state, action) => {
        const { livestockId, record } = action.payload;
        if (!state.healthRecords[livestockId]) {
          state.healthRecords[livestockId] = [];
        }
        state.healthRecords[livestockId].unshift(record);
      })
      
      // Fetch Stats
      .addCase(fetchLivestockStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const {
  setSelectedAnimal,
  clearSelectedAnimal,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = livestockSlice.actions;

export default livestockSlice.reducer;
