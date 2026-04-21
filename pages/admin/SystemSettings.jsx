import React, { useState, useEffect } from 'react';
import { adminQueries } from '../../db/adminQueries';
import { useOffline } from '../../context/OfflineContext';
import { useSync } from '../../context/SyncContext';

const SystemSettings = () => {
  const [systemVersion, setSystemVersion] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newVersion, setNewVersion] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backups, setBackups] = useState([]);
  const { syncPendingChanges, isSyncing } = useSync();

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const version = await adminQueries.getSystemVersion();
      setSystemVersion(version);
      
      // Mock admin profile - in production, get from auth
      setAdminProfile({
        id: 'admin-001',
        name: 'System Administrator',
        email: 'admin@farmaid.bw',
        role: 'admin'
      });
      
      // Load backups (mock)
      setBackups([
        { id: 'BACKUP-20241201', createdAt: '2024-12-01T10:00:00Z', size: '2.4 MB' },
        { id: 'BACKUP-20241125', createdAt: '2024-11-25T14:30:00Z', size: '2.3 MB' }
      ]);
    } catch (error) {
      console.error('Failed to load system data:', error);
    }
  };

  const handleChangeAdminPassword = async (newPassword) => {
    try {
      await adminQueries.changeUserPassword(adminProfile.id, newPassword);
      setShowPasswordModal(false);
      alert('Admin password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    }
  };

  const handleUpdateSystem = async () => {
    if (!newVersion) {
      alert('Please enter a version number');
      return;
    }
    
    try {
      await adminQueries.updateSystemVersion(newVersion, releaseNotes);
      setSystemVersion({ version: newVersion, releaseNotes, lastUpdate: new Date().toISOString() });
      alert(`System updated to version ${newVersion}`);
      setNewVersion('');
      setReleaseNotes('');
    } catch (error) {
      console.error('Failed to update system:', error);
      alert('Failed to update system');
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    try {
      const backup = await adminQueries.createBackup();
      setBackups(prev => [{
        id: backup.id || `BACKUP-${Date.now()}`,
        createdAt: new Date().toISOString(),
        size: 'Calculating...'
      }, ...prev]);
      alert('Backup created successfully');
    } catch (error) {
      console.error('Failed to create backup:', error);
      alert('Failed to create backup');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleSyncNow = async () => {
    await syncPendingChanges();
    alert('Sync completed');
  };

  const handleClearCache = () => {
    if (window.confirm('This will clear all cached data. Are you sure?')) {
      localStorage.clear();
      sessionStorage.clear();
      alert('Cache cleared. The app will reload.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8">
      {/* Admin Profile */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Admin Profile</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-icons-outlined text-primary text-3xl">admin_panel_settings</span>
            </div>
            <div>
              <p className="font-bold text-lg">{adminProfile?.name}</p>
              <p className="text-sage-500">{adminProfile?.email}</p>
              <p className="text-xs text-sage-400 capitalize">{adminProfile?.role}</p>
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="btn-secondary"
            >
              <span className="material-icons-outlined">lock_reset</span>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* System Version */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">System Version</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-sage-50 dark:bg-sage-800/30 rounded-lg">
            <div>
              <p className="font-bold text-lg">v{systemVersion?.version || '1.0.0'}</p>
              <p className="text-sm text-sage-500">Last updated: {systemVersion?.lastUpdate ? new Date(systemVersion.lastUpdate).toLocaleString() : 'Never'}</p>
            </div>
            <span className="status-badge bg-green-100 text-green-700">Stable</span>
          </div>
          
          <div className="border-t border-sage-200 dark:border-sage-800 pt-4">
            <label className="block text-sm font-medium mb-2">Update System</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="New version (e.g., 1.1.0)"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                className="input-field flex-1"
              />
              <button
                onClick={handleUpdateSystem}
                className="btn-primary"
              >
                <span className="material-icons-outlined">system_update</span>
                Update
              </button>
            </div>
            <textarea
              placeholder="Release notes..."
              value={releaseNotes}
              onChange={(e) => setReleaseNotes(e.target.value)}
              rows="3"
              className="input-field mt-3"
            />
          </div>
        </div>
      </div>

      {/* Sync & Backup */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Sync & Backup</h3>
        <div className="space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="btn-primary flex-1"
            >
              <span className="material-icons-outlined">{isSyncing ? 'sync' : 'cloud_sync'}</span>
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="btn-secondary flex-1"
            >
              <span className="material-icons-outlined">backup</span>
              {isBackingUp ? 'Creating...' : 'Create Backup'}
            </button>
          </div>
          
          {backups.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Recent Backups</h4>
              <div className="space-y-2">
                {backups.map(backup => (
                  <div key={backup.id} className="flex justify-between items-center p-3 bg-sage-50 dark:bg-sage-800/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{backup.id}</p>
                      <p className="text-xs text-sage-500">{new Date(backup.createdAt).toLocaleString()}</p>
                    </div>
                    <button className="text-primary text-sm hover:underline">
                      Restore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6">
        <h3 className="text-xl font-bold mb-4">Data Management</h3>
        <div className="space-y-4">
          <button
            onClick={handleClearCache}
            className="btn-secondary w-full"
          >
            <span className="material-icons-outlined">clear_all</span>
            Clear Application Cache
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('WARNING: This will reset all application data. This action cannot be undone. Are you sure?')) {
                alert('Feature coming soon - Contact support for data reset');
              }
            }}
            className="btn-secondary w-full text-red-600 hover:bg-red-50"
          >
            <span className="material-icons-outlined">factory_reset</span>
            Factory Reset (All Data)
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <PasswordChangeModal
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={handleChangeAdminPassword}
        />
      )}
    </div>
  );
};

// Password Change Modal Component
const PasswordChangeModal = ({ onClose, onChangePassword }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    onChangePassword(newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-sage-900 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Change Admin Password</h3>
          <button onClick={onClose}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New Password *</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input-field"
              required
              minLength="6"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemSettings;
