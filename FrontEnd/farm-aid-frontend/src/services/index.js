// Services index file
import aiService from './ai';
import alertService from './alerts';
import api, { del, downloadFile, get, patch, post, put, uploadFile, uploadMultipleFiles } from './api';
import authService from './auth';
import cameraService from './camera';
import consultationService from './consultations';
import diseaseReportService from './diseaseReports';
import geolocationService from './geolocation';
import knowledgeBaseService from './knowledgeBase';
import livestockService from './livestock';
import pushNotificationService from './pushNotifications';
import smsService from './sms';
import socketService from './socket';
import syncService from './sync';

// Service aggregator for convenience
const services = {
  api,
  auth: authService,
  livestock: livestockService,
  diseaseReports: diseaseReportService,
  consultations: consultationService,
  knowledgeBase: knowledgeBaseService,
  alerts: alertService,
  sync: syncService,
  ai: aiService,
  socket: socketService,
  pushNotifications: pushNotificationService,
  sms: smsService,
  geolocation: geolocationService,
  camera: cameraService,
};

export default services;