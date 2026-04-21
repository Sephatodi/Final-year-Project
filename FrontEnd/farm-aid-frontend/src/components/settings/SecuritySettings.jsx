import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

const SecuritySettings = ({ onUpdate }) => {
  const { t } = useTranslation();
  const { changePassword, enable2FA, disable2FA } = useAuth();

  const [activeTab, setActiveTab] = useState('password');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 2FA State
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Session State
  const [sessions, setSessions] = useState([
    { id: 1, device: 'Chrome on Windows', location: 'Francistown', lastActive: '2024-03-14T10:30:00', current: true },
    { id: 2, device: 'Safari on iPhone', location: 'Gaborone', lastActive: '2024-03-13T15:45:00', current: false },
    { id: 3, device: 'Farm-Aid Mobile App', location: 'Maun', lastActive: '2024-03-12T09:20:00', current: false },
  ]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('security.passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError(t('security.passwordTooShort') || 'Password must be at least 8 characters');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handle2FAToggle = async () => {
    if (twoFAEnabled) {
      if (window.confirm(t('security.confirmDisable2FA') || 'Disable two-factor authentication?')) {
        await disable2FA();
        setTwoFAEnabled(false);
      }
    } else {
      setShowQRCode(true);
    }
  };

  const handleVerify2FA = async () => {
    try {
      await enable2FA(verificationCode);
      setTwoFAEnabled(true);
      setShowQRCode(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTerminateSession = (sessionId) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleTerminateAllSessions = () => {
    if (window.confirm(t('security.confirmTerminateAll') || 'Log out of all other devices?')) {
      setSessions(prev => prev.filter(s => s.current));
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.security') || 'Security Settings'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('security.updated') || 'Security settings updated!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            dismissible
            onDismiss={() => setError('')}
          />
        )}

        {/* Tabs */}
        <div className="flex border-b border-sage-200 dark:border-sage-800 mb-6">
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'password'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('security.password') || 'Password'}
          </button>
          <button
            onClick={() => setActiveTab('twofa')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'twofa'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('security.twoFactor') || 'Two-Factor Auth'}
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'sessions'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('security.sessions') || 'Active Sessions'}
          </button>
        </div>

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <Input
              label={t('security.currentPassword') || 'Current Password'}
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              icon="lock"
              required
              fullWidth
            />

            <Input
              label={t('security.newPassword') || 'New Password'}
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              icon="lock"
              required
              fullWidth
            />

            <Input
              label={t('security.confirmPassword') || 'Confirm New Password'}
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              icon="lock"
              required
              fullWidth
            />

            {/* Password Requirements */}
            <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <p className="text-sm font-medium mb-2">{t('security.requirements') || 'Password Requirements:'}</p>
              <ul className="space-y-1 text-sm text-sage-600">
                <li className="flex items-center gap-2">
                  <span className={`material-icons-outlined text-sm ${
                    passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-sage-400'
                  }`}>
                    {passwordData.newPassword.length >= 8 ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {t('security.minLength') || 'At least 8 characters'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-icons-outlined text-sm ${
                    /[A-Z]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-sage-400'
                  }`}>
                    {/[A-Z]/.test(passwordData.newPassword) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {t('security.uppercase') || 'One uppercase letter'}
                </li>
                <li className="flex items-center gap-2">
                  <span className={`material-icons-outlined text-sm ${
                    /[0-9]/.test(passwordData.newPassword) ? 'text-green-600' : 'text-sage-400'
                  }`}>
                    {/[0-9]/.test(passwordData.newPassword) ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                  {t('security.number') || 'One number'}
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="primary"
              icon="lock_reset"
              fullWidth
            >
              {t('security.updatePassword') || 'Update Password'}
            </Button>
          </form>
        )}

        {/* 2FA Tab */}
        {activeTab === 'twofa' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
              <div>
                <p className="font-medium">{t('security.twoFactor') || 'Two-Factor Authentication'}</p>
                <p className="text-sm text-sage-500">
                  {t('security.twoFactorHelp') || 'Add an extra layer of security to your account'}
                </p>
              </div>
              <Button
                variant={twoFAEnabled ? 'danger' : 'primary'}
                onClick={handle2FAToggle}
              >
                {twoFAEnabled ? t('security.disable') || 'Disable' : t('security.enable') || 'Enable'}
              </Button>
            </div>

            {showQRCode && (
              <div className="text-center p-6 border-2 border-dashed border-primary/30 rounded-lg">
                <div className="w-48 h-48 bg-sage-200 dark:bg-sage-800 mx-auto mb-4 flex items-center justify-center">
                  <span className="material-icons-outlined text-6xl text-sage-400">qr_code_scanner</span>
                </div>
                <p className="text-sm mb-4">
                  {t('security.scanQR') || 'Scan this QR code with your authenticator app'}
                </p>
                <div className="flex gap-3 max-w-sm mx-auto">
                  <Input
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t('security.enterCode') || 'Enter 6-digit code'}
                    fullWidth
                  />
                  <Button onClick={handleVerify2FA} variant="primary">
                    {t('common.verify') || 'Verify'}
                  </Button>
                </div>
              </div>
            )}

            {twoFAEnabled && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-icons-outlined text-green-600">check_circle</span>
                  <span>{t('security.twoFAEnabled') || 'Two-factor authentication is enabled'}</span>
                </div>
              </div>
            )}

            {/* Backup Codes */}
            <div className="mt-8">
              <h3 className="font-bold mb-4">{t('security.backupCodes') || 'Backup Codes'}</h3>
              <p className="text-sm text-sage-500 mb-4">
                {t('security.backupHelp') || 'Use these codes if you lose access to your authenticator app'}
              </p>
              <div className="grid grid-cols-2 gap-2 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg font-mono text-center">
                <div>ABCD-1234</div>
                <div>EFGH-5678</div>
                <div>IJKL-9012</div>
                <div>MNOP-3456</div>
              </div>
              <Button variant="secondary" className="mt-4" icon="download">
                {t('security.downloadCodes') || 'Download Backup Codes'}
              </Button>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{t('security.activeSessions') || 'Active Sessions'}</h3>
              <Button
                variant="danger"
                size="sm"
                onClick={handleTerminateAllSessions}
                icon="logout"
              >
                {t('security.logoutAll') || 'Logout All Others'}
              </Button>
            </div>

            <div className="space-y-4">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`p-4 rounded-lg border ${
                    session.current
                      ? 'border-primary bg-primary/5'
                      : 'border-sage-200 dark:border-sage-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        session.current ? 'bg-primary/10' : 'bg-sage-100 dark:bg-sage-800'
                      }`}>
                        <span className={`material-icons-outlined ${
                          session.current ? 'text-primary' : 'text-sage-500'
                        }`}>
                          {session.device.includes('Mobile') ? 'smartphone' : 'computer'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {session.device}
                          {session.current && (
                            <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                              {t('security.current') || 'Current'}
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-sage-500">{session.location}</p>
                        <p className="text-xs text-sage-400 mt-1">
                          {t('security.lastActive') || 'Last active'}: {formatDate(session.lastActive)}
                        </p>
                      </div>
                    </div>

                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminateSession(session.id)}
                        icon="logout"
                      >
                        {t('security.logout') || 'Logout'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

SecuritySettings.propTypes = {
  onUpdate: PropTypes.func,
};

export default SecuritySettings;