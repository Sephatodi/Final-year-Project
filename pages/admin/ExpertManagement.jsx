import React, { useState, useEffect } from 'react';
import { adminQueries } from '../../db/adminQueries';

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [pendingExperts, setPendingExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(null);

  useEffect(() => {
    loadExperts();
  }, []);

  const loadExperts = async () => {
    setLoading(true);
    try {
      const allExperts = await adminQueries.getAllExperts();
      const pending = await adminQueries.getPendingExperts();
      setExperts(allExperts);
      setPendingExperts(pending);
    } catch (error) {
      console.error('Failed to load experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveExpert = async (id) => {
    try {
      const updatedExpert = await adminQueries.approveExpert(id);
      setExperts(prev => prev.map(e => e.id === id ? updatedExpert : e));
      setPendingExperts(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Failed to approve expert:', error);
      alert('Failed to approve expert');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const updatedExpert = await adminQueries.updateExpertStatus(id, !currentStatus);
      setExperts(prev => prev.map(e => e.id === id ? updatedExpert : e));
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const handleChangePassword = async (expertId, newPassword) => {
    try {
      await adminQueries.changeUserPassword(expertId, newPassword);
      setShowPasswordModal(null);
      alert('Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password');
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="space-y-8">
      {/* Pending Approvals Section */}
      {pendingExperts.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-icons-outlined text-yellow-600">pending_actions</span>
            Pending Expert Approvals ({pendingExperts.length})
          </h3>
          
          <div className="space-y-4">
            {pendingExperts.map(expert => (
              <div key={expert.id} className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                    <span className="material-icons-outlined text-yellow-600">person</span>
                  </div>
                  <div>
                    <p className="font-medium">{expert.name}</p>
                    <p className="text-sm text-sage-500">{expert.email} | {expert.phone}</p>
                    {expert.specialization && (
                      <p className="text-xs text-sage-500 mt-1">Specialization: {expert.specialization}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleApproveExpert(expert.id)}
                  className="btn-primary px-6 py-2"
                >
                  <span className="material-icons-outlined">check</span>
                  Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Experts List */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
          <h3 className="font-bold text-lg">Active Experts ({experts.filter(e => e.isApproved).length})</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-sage-50 dark:bg-sage-900/20 text-sage-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap">Expert</th>
                <th className="px-6 py-4 whitespace-nowrap">Specialization</th>
                <th className="px-6 py-4 whitespace-nowrap">License #</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 dark:divide-sage-800">
              {experts.filter(e => e.isApproved).map(expert => (
                <tr key={expert.id} className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="font-medium">{expert.name}</p>
                      <p className="text-xs text-sage-500">{expert.email}</p>
                    </div>
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expert.specialization || 'General'}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expert.licenseNumber || 'N/A'}
                   </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(expert.id, expert.isActive)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expert.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {expert.isActive !== false ? 'Active' : 'Inactive'}
                    </button>
                   </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowPasswordModal(expert)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Change Password"
                      >
                        <span className="material-icons-outlined">lock_reset</span>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(expert.id, expert.isActive !== false)}
                        className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        title={expert.isActive !== false ? 'Deactivate' : 'Activate'}
                      >
                        <span className="material-icons-outlined">
                          {expert.isActive !== false ? 'block' : 'check_circle'}
                        </span>
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
           </table>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <PasswordChangeModal
          user={showPasswordModal}
          onClose={() => setShowPasswordModal(null)}
          onChangePassword={handleChangePassword}
        />
      )}
    </div>
  );
};

// Reuse PasswordChangeModal from UserManagement or define here
const PasswordChangeModal = ({ user, onClose, onChangePassword }) => {
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
    onChangePassword(user.id, newPassword);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-sage-900 rounded-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Change Password</h3>
          <button onClick={onClose}>
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        
        <p className="text-sm text-sage-500 mb-4">
          Changing password for: <span className="font-medium text-sage-900 dark:text-white">{user.name}</span>
        </p>
        
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

export default ExpertManagement;
