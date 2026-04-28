import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import syncService from '../../services/syncService';

export const syncAll = createAsyncThunk(
  'sync/syncAll',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await syncService.syncAll();
      dispatch(setLastSync(new Date().toISOString()));
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Sync failed');
    }
  }
);

export const fetchSyncStatus = createAsyncThunk(
  'sync/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await syncService.getStatus();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sync status');
    }
  }
);

export const fetchSyncHistory = createAsyncThunk(
  'sync/fetchHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await syncService.getHistory(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch sync history');
    }
  }
);

export const resolveConflict = createAsyncThunk(
  'sync/resolveConflict',
  async ({ conflictId, resolution }, { rejectWithValue }) => {
    try {
      const response = await syncService.resolveConflict(conflictId, resolution);
      return { conflictId, resolution, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resolve conflict');
    }
  }
);

const initialState = {
  isSyncing: false,
  lastSync: null,
  pendingChanges: 0,
  syncError: null,
  syncHistory: [],
  conflicts: [],
  autoSync: true,
  syncProgress: null,
  stats: {
    totalSyncs: 0,
    successfulSyncs: 0,
    failedSyncs: 0,
  },
};

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setLastSync: (state, action) => {
      state.lastSync = action.payload;
    },
    setPendingChanges: (state, action) => {
      state.pendingChanges = action.payload;
    },
    setAutoSync: (state, action) => {
      state.autoSync = action.payload;
    },
    setSyncProgress: (state, action) => {
      state.syncProgress = action.payload;
    },
    clearSyncError: (state) => {
      state.syncError = null;
    },
    addConflict: (state, action) => {
      state.conflicts.push(action.payload);
    },
    clearConflicts: (state) => {
      state.conflicts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Sync All
      .addCase(syncAll.pending, (state) => {
        state.isSyncing = true;
        state.syncError = null;
        state.syncProgress = { current: 0, total: state.pendingChanges };
      })
      .addCase(syncAll.fulfilled, (state, action) => {
        state.isSyncing = false;
        state.lastSync = new Date().toISOString();
        state.pendingChanges = 0;
        state.syncProgress = null;
        state.stats.totalSyncs++;
        state.stats.successfulSyncs++;
        
        // Add to history
        state.syncHistory.unshift({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          status: 'success',
          details: action.payload,
        });
        
        // Keep only last 50 history items
        if (state.syncHistory.length > 50) {
          state.syncHistory.pop();
        }
      })
      .addCase(syncAll.rejected, (state, action) => {
        state.isSyncing = false;
        state.syncError = action.payload;
        state.syncProgress = null;
        state.stats.totalSyncs++;
        state.stats.failedSyncs++;
        
        // Add to history
        state.syncHistory.unshift({
          id: Date.now(),
          timestamp: new Date().toISOString(),
          status: 'failed',
          error: action.payload,
        });
      })
      
      // Fetch Sync Status
      .addCase(fetchSyncStatus.fulfilled, (state, action) => {
        state.pendingChanges = action.payload.pendingChanges || 0;
        state.lastSync = action.payload.lastSync || state.lastSync;
      })
      
      // Fetch Sync History
      .addCase(fetchSyncHistory.fulfilled, (state, action) => {
        state.syncHistory = action.payload;
      })
      
      // Resolve Conflict
      .addCase(resolveConflict.fulfilled, (state, action) => {
        state.conflicts = state.conflicts.filter(c => c.id !== action.payload.conflictId);
      });
  },
});

export const {
  setLastSync,
  setPendingChanges,
  setAutoSync,
  setSyncProgress,
  clearSyncError,
  addConflict,
  clearConflicts,
} = syncSlice.actions;

export default syncSlice.reducer;
