import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Alert from '../common/Alert';
import Card from '../common/Card';

const BiometricLogin = () => {
  const navigate = useNavigate();
  const { biometricLogin } = useAuth();
  const { t } = useTranslation();

  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [biometricSupported, setBiometricSupported] = useState(true);

  useEffect(() => {
    // Check if biometric authentication is supported
    if (!window.PublicKeyCredential) {
      setBiometricSupported(false);
      setError(t('auth.errors.biometricNotSupported') || 'Biometric authentication is not supported on this device');
    }
  }, [t]);

  const handleBiometricScan = async () => {
    setIsScanning(true);
    setError('');

    try {
      // Simulate biometric scan (in production, use WebAuthn API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await biometricLogin();
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setError(response.error || 'Biometric authentication failed');
      }
    } catch (error) {
      setError(error.message || 'An error occurred during biometric scan');
    } finally {
      setIsScanning(false);
    }
  };

  const handleUsePassword = () => {
    navigate('/login');
  };

  const handleSetupBiometric = () => {
    navigate('/settings/security');
  };

  if (!biometricSupported) {
    return (
      <Card className="w-full max-w-md mx-auto text-center">
        <Alert
          type="warning"
          title={t('auth.biometric.notSupported') || 'Not Supported'}
          message={error}
          className="mb-6"
        />
        <Button
          variant="primary"
          onClick={handleUsePassword}
          icon="login"
        >
          {t('auth.login.button') || 'Use Password Instead'}
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <div className="mb-8">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <span className="material-icons-outlined text-5xl text-primary">fingerprint</span>
          {isScanning && (
            <span className="absolute inset-0 animate-ping bg-primary/20 rounded-full"></span>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {t('auth.biometric.title') || 'Biometric Login'}
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          {isScanning 
            ? (t('auth.biometric.scanning') || 'Scanning...') 
            : (t('auth.biometric.instructions') || 'Use your fingerprint or face ID to log in')}
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

      <div className="space-y-4">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleBiometricScan}
          loading={isScanning}
          icon="fingerprint"
        >
          {isScanning 
            ? (t('auth.biometric.scanning') || 'Scanning...') 
            : (t('auth.biometric.scan') || 'Scan Biometric')}
        </Button>

        <Button
          variant="ghost"
          fullWidth
          onClick={handleUsePassword}
          icon="lock"
        >
          {t('auth.usePassword') || 'Use Password Instead'}
        </Button>

        <Button
          variant="ghost"
          fullWidth
          onClick={handleSetupBiometric}
          icon="settings"
        >
          {t('auth.biometric.setup') || 'Set Up Biometric'}
        </Button>
      </div>

      <div className="mt-8 pt-6 border-t border-sage-200 dark:border-sage-800">
        <p className="text-xs text-sage-500">
          {t('auth.biometric.securityNote') || 'Your biometric data never leaves your device and is securely stored using your device\'s security hardware.'}
        </p>
      </div>
    </Card>
  );
};

export default BiometricLogin;