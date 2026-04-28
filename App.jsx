import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import KnowledgeBase from './pages/KnowledgeBase'
import SymptomChecker from './pages/SymptomChecker'
import AdminDashboard from './pages/Admin/AdminDashboard'
import KnowledgeBaseAdmin from './pages/admin/KnowledgeBaseAdmin'
import './App.css'
import { OfflineProvider } from './context/OfflineContext'
import { SyncProvider } from './context/SyncContext'

function Sidebar() {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Knowledge Base', icon: 'menu_book' },
    { path: '/symptom-checker', label: 'Symptom Checker', icon: 'medical_services' },
    { path: '/kb-admin', label: 'KB Data Entry', icon: 'edit_document' },
    { path: '/admin', label: 'Admin Dashboard', icon: 'admin_panel_settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-sage-200 dark:border-sage-800 dark:bg-sage-900 min-h-screen sticky top-0 hidden md:flex md:flex-col z-40">
      <div className="p-6 border-b border-sage-200 dark:border-sage-800 shrink-0">
        <h1 className="text-2xl font-black text-primary flex items-center gap-2">
          <span className="material-icons-outlined text-3xl">pets</span>
          FarmAid
        </h1>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
              location.pathname === item.path
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-sage-600 hover:bg-sage-50 hover:text-primary dark:text-sage-400 dark:hover:bg-sage-800/50'
            }`}
          >
            <span className="material-icons-outlined shrink-0">{item.icon}</span>
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Footer info */}
      <div className="p-4 shrink-0 border-t border-sage-200 dark:border-sage-800">
         <div className="p-4 bg-sage-50 dark:bg-sage-800/50 rounded-xl text-center">
            <p className="text-xs font-bold text-sage-500 uppercase tracking-widest">FarmAid System</p>
            <p className="text-xs text-sage-400 mt-1">v1.0.0</p>
         </div>
      </div>
    </div>
  );
}

function MobileNav() {
  const location = useLocation();
  const navItems = [
    { path: '/', icon: 'menu_book' },
    { path: '/symptom-checker', icon: 'medical_services' },
    { path: '/kb-admin', icon: 'edit_document' },
    { path: '/admin', icon: 'admin_panel_settings' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-sage-900 border-t border-sage-200 dark:border-sage-800 flex justify-around p-3 z-50">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
            location.pathname === item.path
              ? 'bg-primary text-white shadow-md'
              : 'text-sage-500 hover:bg-sage-50 dark:hover:bg-sage-800'
          }`}
        >
          <span className="material-icons-outlined text-2xl">{item.icon}</span>
        </Link>
      ))}
    </div>
  )
}

function App() {
  return (
    <OfflineProvider>
      <SyncProvider>
        <Router>
          <div className="min-h-screen bg-sage-50 dark:bg-sage-950 flex">
            {/* Sidebar Navigation */}
            <Sidebar />
            
            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-8 min-w-0 overflow-x-hidden pb-24 md:pb-8">
              <div className="max-w-6xl mx-auto w-full">
                <Routes>
                  <Route path="/" element={<KnowledgeBase />} />
                  <Route path="/symptom-checker" element={<SymptomChecker />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/kb-admin" element={<KnowledgeBaseAdmin />} />
                </Routes>
              </div>
            </main>
            
            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </Router>
      </SyncProvider>
    </OfflineProvider>
  )
}

export default App