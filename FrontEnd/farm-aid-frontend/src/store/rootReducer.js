import { combineReducers } from '@reduxjs/toolkit';

import alertReducer from './slices/alertSlice';
import authReducer from './slices/authSlice';
import consultationReducer from './slices/consultationSlice';
import diseaseReducer from './slices/diseaseSlice';
import knowledgeReducer from './slices/knowledgeSlice';
import livestockReducer from './slices/livestockSlice';
import syncReducer from './slices/syncSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  livestock: livestockReducer,
  disease: diseaseReducer,
  consultations: consultationReducer,
  knowledge: knowledgeReducer,
  alerts: alertReducer,
  sync: syncReducer,
  ui: uiReducer,
});

export default rootReducer;