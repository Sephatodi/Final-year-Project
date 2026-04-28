import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import All Pages
import LandingPage from './pages/LandingPage';
// Add to imports
import EducationalDashboard from './pages/EducationalDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import AlertsNotifications from './pages/Alerts';
import FarmerDashboard from './pages/FarmerDashboard';
import KnowledgeBase from './pages/KnowledgeBase';
import KnowledgeArticle from './pages/KnowledgeArticle';
import Reports from './pages/Reports';
import HerdRecords from './pages/HerdRecords';
import SecuritySettings from './pages/SecuritySettings';
import AccountSettings from './pages/AccountSettings';
import SymptomChecker from './pages/SymptomChecker';
import DiseaseReporting from './pages/DiseaseReporting';
import VetDashboard from './pages/VetDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TelehealthVetConsult from './pages/TelehealthVetConsult';
import IntegratedTelehealth from './pages/IntegratedTelehealth';
import FarmerConsultation from './pages/FarmerConsultation';
import DiseaseClassifier from './components/diseaseReporting/DiseaseClassifier';
import ProtectedRoute from './components/ProtectedRoute';
import { initializeDatabase, getAllDiseases, searchDiseasesBySymptom } from './db/diseases-db.js';
import { AuthProvider } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { SyncProvider } from './context/SyncContext';
import NotificationCenter from './pages/NotificationCenter';
import Patients from './pages/Patients';

import './index.css';

/**
 * Main application entry point configured with React Router.
 * Handles primary navigation across the various offline-first modules.
 */
function App() {
  // Run this once when app starts
  useEffect(() => {
    const setupDB = async () => {
      await initializeDatabase();
      const diseases = await getAllDiseases();
      console.log('Loaded diseases:', diseases.length);
    };
    setupDB();
  }, []);

  return (
    <OfflineProvider>
      <SyncProvider>
        <AuthProvider>
          <div className="App w-full min-h-screen bg-[#F8F9FA]">
            <Routes>
              {/* Public / Entry Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/learn" element={<EducationalDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Core Farmer Flow */}
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route path="/herd-records" element={<HerdRecords />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="/article/:id" element={<KnowledgeArticle />} />
              <Route path="/alerts" element={<AlertsNotifications />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/account-settings" element={<AccountSettings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/report-disease" element={<DiseaseReporting />} />
              <Route path="/ai-detector" element={<DiseaseClassifier />} />
              <Route path="/telehealth" element={<IntegratedTelehealth />} />

              <Route path="/vet-dashboard" element={<VetDashboard />} />
              <Route path="/vet-telehealth" element={<TelehealthVetConsult />} />
              <Route path="/admin-console" element={<AdminDashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/notification-center" element={<NotificationCenter />} />
              <Route path="/integrated-telehealth" element={<IntegratedTelehealth />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </SyncProvider>
    </OfflineProvider>
  );
}

export default App;
