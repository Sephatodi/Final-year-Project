import React, { useState, useEffect } from 'react';
import { adminQueries } from '../../db/adminQueries';
import { useOffline } from '../../context/OfflineContext';
import { useSync } from '../../context/SyncContext';
import UserManagement from './UserManagement';
import ExpertManagement from './ExpertManagement';
import ContentManagement from './ContentManagement';
import DiseaseReportsManagement from './DiseaseReportsManagement';
import SystemSettings from './SystemSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOffline } = useOffline();
  const { isSyncing } = useSync();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const systemStats = await adminQueries.getSystemStats();
      setStats(systemStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'users', label: 'User Management', icon: 'people' },
    { id: 'experts', label: 'Expert Management', icon: 'medical_services' },
    { id: 'content', label: 'Content Management', icon: 'menu_book' },
    { id: 'reports', label: 'Disease Reports', icon: 'warning' },
    { id: 'settings', label: 'System Settings', icon: 'settings' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-display font-black tracking-tight text-sage-900 dark:text-slate-100">
          Admin Dashboard
        </h2>
        <p className="text-sage-500 mt-1">Manage users, content, and system settings</p>
      </div>

      {/* Offline/Sync Status */}
      {(isOffline || isSyncing) && (
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isOffline 
            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
            : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
        }`}>
          <span className="material-icons-outlined text-sm">
            {isOffline ? 'cloud_off' : 'sync'}
          </span>
          <span className="text-sm">
            {isOffline 
              ? 'Working offline - Changes will sync when online'
              : isSyncing ? 'Syncing changes...' : 'All changes synced'}
          </span>
        </div>
      )}

      {/* Stats Cards - Only show on overview tab */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <span className="material-icons-outlined text-blue-600 dark:text-blue-400">people</span>
              </div>
            </div>
            <p className="text-sage-500 text-sm font-medium">Total Users</p>
            <h3 className="text-3xl font-black mt-1">{stats.totalUsers}</h3>
            <div className="mt-2 text-xs text-sage-500">
              {stats.totalFarmers} farmers, {stats.totalExperts} experts
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <span className="material-icons-outlined text-yellow-600 dark:text-yellow-400">pending_actions</span>
              </div>
            </div>
            <p className="text-sage-500 text-sm font-medium">Pending Approvals</p>
            <h3 className="text-3xl font-black mt-1">
              {stats.pendingApprovals.experts + stats.pendingApprovals.farmers + stats.pendingApprovals.articles}
            </h3>
            <div className="mt-2 text-xs text-sage-500">
              {stats.pendingApprovals.experts} experts, {stats.pendingApprovals.articles} articles
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="material-icons-outlined text-green-600 dark:text-green-400">pets</span>
              </div>
            </div>
            <p className="text-sage-500 text-sm font-medium">Total Livestock</p>
            <h3 className="text-3xl font-black mt-1">{stats.totalLivestock}</h3>
            <div className="mt-2 text-xs text-sage-500">Registered animals</div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <span className="material-icons-outlined text-red-600 dark:text-red-400">warning</span>
              </div>
            </div>
            <p className="text-sage-500 text-sm font-medium">Disease Reports</p>
            <h3 className="text-3xl font-black mt-1">{stats.totalReports}</h3>
            <div className="mt-2 text-xs text-sage-500">
              {stats.pendingApprovals.reports} pending review
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-sage-200 dark:border-sage-800">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-sage-500 hover:text-sage-700 dark:hover:text-sage-300'
              }`}
            >
              <span className="material-icons-outlined text-lg shrink-0">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Recent Activity Preview */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-sage-50 dark:bg-sage-800/30 rounded-lg">
                  <span className="material-icons-outlined text-green-600">person_add</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">3 new farmers registered</p>
                    <p className="text-xs text-sage-500">Last 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-sage-50 dark:bg-sage-800/30 rounded-lg">
                  <span className="material-icons-outlined text-yellow-600">pending</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">2 expert applications pending</p>
                    <p className="text-xs text-sage-500">Requires review</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-sage-50 dark:bg-sage-800/30 rounded-lg">
                  <span className="material-icons-outlined text-red-600">warning</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">5 disease reports submitted</p>
                    <p className="text-xs text-sage-500">Awaiting verification</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-primary/10 rounded-xl text-center hover:bg-primary/20 transition-colors">
                  <span className="material-icons-outlined text-primary text-2xl mb-2">person_add</span>
                  <p className="text-sm font-medium">Add User</p>
                </button>
                <button className="p-4 bg-primary/10 rounded-xl text-center hover:bg-primary/20 transition-colors">
                  <span className="material-icons-outlined text-primary text-2xl mb-2">add_circle</span>
                  <p className="text-sm font-medium">Add Article</p>
                </button>
                <button className="p-4 bg-primary/10 rounded-xl text-center hover:bg-primary/20 transition-colors">
                  <span className="material-icons-outlined text-primary text-2xl mb-2">backup</span>
                  <p className="text-sm font-medium">Backup Data</p>
                </button>
                <button className="p-4 bg-primary/10 rounded-xl text-center hover:bg-primary/20 transition-colors">
                  <span className="material-icons-outlined text-primary text-2xl mb-2">sync</span>
                  <p className="text-sm font-medium">Force Sync</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'experts' && <ExpertManagement />}
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'reports' && <DiseaseReportsManagement />}
        {activeTab === 'settings' && <SystemSettings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
