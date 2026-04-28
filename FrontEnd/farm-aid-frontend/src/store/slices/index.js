// Slices index file
import alertSlice, { dismissAlert, fetchAlerts, markAsRead } from './alertSlice';
import authSlice, { biometricLogin, login, logout, offlineLogin, register } from './authSlice';
import consultationSlice, { createConsultation, fetchConsultations, sendMessage } from './consultationSlice';
import diseaseSlice, { checkSymptoms, fetchReports, submitReport } from './diseaseSlice';
import knowledgeSlice, { fetchArticle, fetchArticles, searchArticles } from './knowledgeSlice';
import livestockSlice, { addLivestock, deleteLivestock, fetchLivestock, updateLivestock } from './livestockSlice';
import syncSlice, { fetchSyncStatus, syncAll } from './syncSlice';
import uiSlice, { setTheme, showToast, toggleTheme } from './uiSlice';
import userSlice, { changePassword, updateFarmDetails, updateProfile } from './userSlice';

// Combine all slices for easy access
const slices = {
  auth: authSlice,
  user: userSlice,
  livestock: livestockSlice,
  disease: diseaseSlice,
  consultation: consultationSlice,
  knowledge: knowledgeSlice,
  alert: alertSlice,
  sync: syncSlice,
  ui: uiSlice,
};

export default slices;