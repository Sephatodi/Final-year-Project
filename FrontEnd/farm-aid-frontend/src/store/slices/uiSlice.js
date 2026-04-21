import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  sidebarOpen: true,
  mobileMenuOpen: false,
  notifications: [],
  modals: {
    addLivestock: false,
    reportDisease: false,
    consultation: false,
    confirmDialog: false,
  },
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
  loading: {
    global: false,
    buttons: {},
  },
  viewMode: {
    livestock: 'table',
    knowledge: 'grid',
  },
  language: 'en',
  fontSize: 'md',
  compactMode: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    openModal: (state, action) => {
      state.modals[action.payload] = true;
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    showToast: (state, action) => {
      state.toast = {
        visible: true,
        ...action.payload,
      };
    },
    hideToast: (state) => {
      state.toast.visible = false;
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setButtonLoading: (state, action) => {
      const { button, loading } = action.payload;
      state.loading.buttons[button] = loading;
    },
    setViewMode: (state, action) => {
      const { view, mode } = action.payload;
      state.viewMode[view] = mode;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setFontSize: (state, action) => {
      state.fontSize = action.payload;
    },
    toggleCompactMode: (state) => {
      state.compactMode = !state.compactMode;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString(),
        ...action.payload,
      });
    },
    markNotificationAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => {
        n.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebar,
  setMobileMenuOpen,
  toggleMobileMenu,
  openModal,
  closeModal,
  showToast,
  hideToast,
  setGlobalLoading,
  setButtonLoading,
  setViewMode,
  setLanguage,
  setFontSize,
  toggleCompactMode,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  removeNotification,
} = uiSlice.actions;

export default uiSlice.reducer;