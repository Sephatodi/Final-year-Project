import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Card from '../common/Card';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { resetPassword } = useAuth();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError(t('auth.errors.invalidToken') || 'Invalid reset link');
    }
  }, [token, t]);

  const validatePassword = () => {
    if (password.length < 6) {
      setError(t('auth.errors.passwordLength') || 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch') || 'Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await resetPassword(token, password);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(response.error || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-icons-outlined text-3xl text-green-600">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {t('auth.passwordReset.success') || 'Password Reset Successful'}
        </h2>
        <p className="text-sage-600 dark:text-sage-400 mb-6">
          {t('auth.passwordReset.redirectMessage') || 'You will be redirected to login in 3 seconds...'}
        </p>
        <Link to="/login">
          <Button variant="primary" icon="login">
            {t('auth.login.button') || 'Go to Login Now'}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {t('auth.resetPassword.title') || 'Reset Password'}
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          {t('auth.resetPassword.subtitle') || 'Enter your new password below'}
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
        <div className="relative">
          <Input
            label={t('auth.newPassword') || 'New Password'}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            icon="lock"
            placeholder="••••••••"
            required
            fullWidth
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

        <div className="relative">
          <Input
            label={t('auth.confirmPassword') || 'Confirm Password'}
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon="lock"
            placeholder="••••••••"
            required
            fullWidth
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-sage-400 hover:text-sage-600"
          >
            <span className="material-icons-outlined">
              {showConfirmPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isLoading}
          icon="lock_reset"
        >
          {t('auth.resetPassword.button') || 'Reset Password'}
        </Button>

        <p className="text-center">
          <Link to="/login" className="text-sm text-primary hover:underline">
            {t('auth.backToLogin') || 'Back to Login'}
          </Link>
        </p>
      </form>
    </Card>
  );
};

export default ResetPassword;