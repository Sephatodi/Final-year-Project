import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import consultationService from '../../services/consultationService';

export const fetchConsultations = createAsyncThunk(
  'consultations/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await consultationService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch consultations');
    }
  }
);

export const createConsultation = createAsyncThunk(
  'consultations/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await consultationService.create(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create consultation');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'consultations/fetchMessages',
  async (consultationId, { rejectWithValue }) => {
    try {
      const response = await consultationService.getMessages(consultationId);
      return { consultationId, messages: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'consultations/sendMessage',
  async ({ consultationId, content, attachments }, { rejectWithValue }) => {
    try {
      const response = await consultationService.sendMessage(consultationId, { content, attachments });
      return { consultationId, message: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to send message');
    }
  }
);

export const resolveConsultation = createAsyncThunk(
  'consultations/resolve',
  async ({ id, resolution }, { rejectWithValue }) => {
    try {
      const response = await consultationService.resolve(id, resolution);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to resolve consultation');
    }
  }
);

export const rateConsultation = createAsyncThunk(
  'consultations/rate',
  async ({ id, rating, feedback }, { rejectWithValue }) => {
    try {
      const response = await consultationService.rate(id, rating, feedback);
      return { id, rating, feedback, ...response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to rate consultation');
    }
  }
);

const initialState = {
  consultations: [],
  selectedConsultation: null,
  messages: {},
  loading: false,
  error: null,
  unreadCount: 0,
  filters: {
    status: 'all',
    priority: 'all',
  },
};

const consultationSlice = createSlice({
  name: 'consultations',
  initialState,
  reducers: {
    setSelectedConsultation: (state, action) => {
      state.selectedConsultation = action.payload;
    },
    clearSelectedConsultation: (state) => {
      state.selectedConsultation = null;
    },
    addMessage: (state, action) => {
      const { consultationId, message } = action.payload;
      if (!state.messages[consultationId]) {
        state.messages[consultationId] = [];
      }
      state.messages[consultationId].push(message);
      
      // Update unread count
      if (message.senderId !== 'current-user') {
        const consultation = state.consultations.find(c => c.id === consultationId);
        if (consultation) {
          consultation.unreadCount = (consultation.unreadCount || 0) + 1;
          state.unreadCount++;
        }
      }
    },
    markAsRead: (state, action) => {
      const consultationId = action.payload;
      const consultation = state.consultations.find(c => c.id === consultationId);
      if (consultation) {
        state.unreadCount -= consultation.unreadCount || 0;
        consultation.unreadCount = 0;
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
      // Fetch Consultations
      .addCase(fetchConsultations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsultations.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations = action.payload;
        state.unreadCount = action.payload.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      })
      .addCase(fetchConsultations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Consultation
      .addCase(createConsultation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createConsultation.fulfilled, (state, action) => {
        state.loading = false;
        state.consultations.unshift(action.payload);
      })
      .addCase(createConsultation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Messages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages[action.payload.consultationId] = action.payload.messages;
      })
      
      // Send Message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { consultationId, message } = action.payload;
        if (!state.messages[consultationId]) {
          state.messages[consultationId] = [];
        }
        state.messages[consultationId].push(message);
      })
      
      // Resolve Consultation
      .addCase(resolveConsultation.fulfilled, (state, action) => {
        const index = state.consultations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.consultations[index] = action.payload;
        }
        if (state.selectedConsultation?.id === action.payload.id) {
          state.selectedConsultation = action.payload;
        }
      })
      
      // Rate Consultation
      .addCase(rateConsultation.fulfilled, (state, action) => {
        const index = state.consultations.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.consultations[index].rated = true;
          state.consultations[index].rating = action.payload.rating;
        }
      });
  },
});

export const {
  setSelectedConsultation,
  clearSelectedConsultation,
  addMessage,
  markAsRead,
  setFilters,
  clearError,
} = consultationSlice.actions;

export default consultationSlice.reducer;
