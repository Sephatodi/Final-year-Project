import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import knowledgeBaseService from '../../services/knowledgeBaseService';

export const fetchArticles = createAsyncThunk(
  'knowledge/fetchArticles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await knowledgeBaseService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch articles');
    }
  }
);

export const searchArticles = createAsyncThunk(
  'knowledge/search',
  async (query, { rejectWithValue }) => {
    try {
      const response = await knowledgeBaseService.search(query);
      return { query, results: response };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Search failed');
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'knowledge/fetchArticle',
  async (id, { rejectWithValue }) => {
    try {
      const response = await knowledgeBaseService.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch article');
    }
  }
);

export const fetchNotifiable = createAsyncThunk(
  'knowledge/fetchNotifiable',
  async (_, { rejectWithValue }) => {
    try {
      const response = await knowledgeBaseService.getNotifiable();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch notifiable diseases');
    }
  }
);

export const fetchOfflineBundle = createAsyncThunk(
  'knowledge/fetchOfflineBundle',
  async (_, { rejectWithValue }) => {
    try {
      const response = await knowledgeBaseService.getOfflineBundle();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch offline bundle');
    }
  }
);

const initialState = {
  articles: [],
  selectedArticle: null,
  searchResults: [],
  notifiable: [],
  categories: [],
  offlineBundle: null,
  loading: false,
  error: null,
  lastSearch: '',
  filters: {
    category: 'all',
    species: 'all',
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
  },
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    setSelectedArticle: (state, action) => {
      state.selectedArticle = action.payload;
    },
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.lastSearch = '';
    },
    clearError: (state) => {
      state.error = null;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Articles
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload.articles || action.payload;
        state.pagination.total = action.payload.total || action.payload.length;
        
        // Extract unique categories
        const cats = [...new Set((action.payload.articles || action.payload).map(a => a.category))];
        state.categories = cats.map(c => ({ id: c, name: c }));
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search Articles
      .addCase(searchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload.results;
        state.lastSearch = action.payload.query;
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Single Article
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Notifiable
      .addCase(fetchNotifiable.fulfilled, (state, action) => {
        state.notifiable = action.payload;
      })
      
      // Fetch Offline Bundle
      .addCase(fetchOfflineBundle.fulfilled, (state, action) => {
        state.offlineBundle = action.payload;
        state.articles = action.payload.articles || state.articles;
      });
  },
});

export const {
  setSelectedArticle,
  clearSelectedArticle,
  setFilters,
  clearSearch,
  clearError,
  setPagination,
} = knowledgeSlice.actions;

export default knowledgeSlice.reducer;
