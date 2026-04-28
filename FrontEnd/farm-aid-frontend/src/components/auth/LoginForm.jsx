import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Card from '../common/Card';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, offlineLogin } = useAuth();
  const { t } = useTranslation();
  const { isOffline } = useOffline();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.errors.phoneRequired') || 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('auth.errors.phoneInvalid') || 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired') || 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await login(formData.phone, formData.password, formData.rememberMe);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setLoginError(response.error || t('auth.errors.loginFailed') || 'Login failed');
      }
    } catch (error) {
      setLoginError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBiometricLogin = () => {
    navigate('/biometric-login');
  };

  const handleOfflineLogin = () => {
    navigate('/offline-login');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-3xl text-primary">agriculture</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">{t('auth.login.title') || 'Welcome Back'}</h2>
        <p className="text-sage-600 dark:text-sage-400">
          {t('auth.login.subtitle') || 'Log in to manage your herd records'}
        </p>
      </div>

      {loginError && (
        <Alert
          type="error"
          message={loginError}
          dismissible
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label={t('auth.phone') || 'Phone Number'}
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon="phone"
          placeholder="e.g., +267 71 234 567"
          required
          fullWidth
          autoComplete="tel"
        />

        <div className="relative">
          <Input
            label={t('auth.password') || 'Password'}
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon="lock"
            placeholder="••••••••"
            required
            fullWidth
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-sage-400 hover:text-sage-600"
          >
            <span className="material-icons-outlined">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-sage-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-sage-700 dark:text-sage-300">
              {t('auth.rememberMe') || 'Remember me'}
            </span>
          </label>

          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            {t('auth.forgotPassword') || 'Forgot Password?'}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          icon="login"
        >
          {t('auth.login.button') || 'Log In'}
        </Button>

        {/* Alternative Login Options */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-sage-200 dark:border-sage-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-sage-900 text-sage-500">
              {t('auth.or') || 'or'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBiometricLogin}
            icon="fingerprint"
          >
            {t('auth.biometric') || 'Biometric'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleOfflineLogin}
            icon="cloud_off"
            disabled={!isOffline}
          >
            {t('auth.offline') || 'Offline'}
          </Button>
        </div>

        {isOffline && (
          <Alert
            type="warning"
            message={t('auth.offlineWarning') || 'You are offline. Please use offline login or connect to the internet.'}
            className="mt-4"
          />
        )}
      </form>

      <p className="mt-8 text-center text-sm text-sage-600 dark:text-sage-400">
        {t('auth.noAccount') || "Don't have an account?"}{' '}
        <Link to="/register" className="text-primary font-bold hover:underline">
          {t('auth.signUp') || 'Sign up'}
        </Link>
      </p>

      {/* Security Note */}
      <div className="mt-6 flex items-center justify-center gap-4 opacity-40">
        <div className="flex items-center gap-1">
          <span className="material-icons-outlined text-xs">verified_user</span>
          <span className="text-[10px] uppercase font-bold tracking-widest">
            {t('auth.encrypted') || 'Encrypted'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons-outlined text-xs">cloud_off</span>
          <span className="text-[10px] uppercase font-bold tracking-widest">
            {t('auth.offlineSync') || 'Offline-Sync'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default LoginForm;