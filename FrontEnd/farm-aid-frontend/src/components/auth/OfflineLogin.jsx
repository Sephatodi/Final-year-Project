import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOffline } from '../../hooks/useOffline';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Card from '../common/Card';

const OfflineLogin = () => {
  const navigate = useNavigate();
  const { offlineLogin } = useAuth();
  const { isOffline } = useOffline();
  const { t } = useTranslation();

  const [offlineUuid, setOfflineUuid] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!offlineUuid.trim()) {
      setError(t('auth.errors.uuidRequired') || 'Offline ID is required');
      return;
    }

    if (!pin || pin.length !== 4) {
      setError(t('auth.errors.pinRequired') || '4-digit PIN is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await offlineLogin(offlineUuid, pin);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.error || 'Offline login failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOffline) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <Alert
          type="info"
          title={t('auth.onlineMode') || 'You are online'}
          message={t('auth.useOnlineLogin') || 'You are currently online. Would you like to use standard login instead?'}
          className="mb-6"
        />
        <div className="flex gap-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            fullWidth
          >
            {t('auth.login.button') || 'Go to Login'}
          </Button>
          <Button
            variant="primary"
            onClick={() => window.location.reload()}
            fullWidth
          >
            {t('common.refresh') || 'Refresh'}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-3xl text-amber-600">cloud_off</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {t('auth.offline.title') || 'Offline Login'}
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          {t('auth.offline.instructions') || 'You are offline. Use your offline credentials to log in.'}
        </p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onDismiss={() => setError('')}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('auth.offline.id') || 'Offline ID'}
          value={offlineUuid}
          onChange={(e) => setOfflineUuid(e.target.value)}
          icon="badge"
          placeholder="e.g., f47ac10b-58cc-4372-a567-0e02b2c3d479"
          helper={t('auth.offline.idHelper') || 'Find this in your offline credentials'}
          required
          fullWidth
        />

        <Input
          label={t('auth.offline.pin') || '4-digit PIN'}
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
          icon="pin"
          placeholder="****"
          maxLength={4}
          required
          fullWidth
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          icon="cloud_off"
        >
          {t('auth.offline.login') || 'Login Offline'}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sm text-primary hover:underline"
          >
            {t('auth.tryOnline') || 'Try Online Login'}
          </button>
          <p className="text-xs text-sage-500">
            {t('auth.offline.note') || 'Offline login only works if you have previously enabled offline access.'}
          </p>
        </div>
      </form>
    </Card>
  );
};

export default OfflineLogin;