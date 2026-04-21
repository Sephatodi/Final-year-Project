import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Input from '../common/Input';
import Alert from '../common/Alert';
import Card from '../common/Card';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const { t } = useTranslation();

  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP, 3: reset password

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError(t('auth.errors.phoneRequired') || 'Phone number is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword.requestOTP(phone);
      if (response.success) {
        setOtpSent(true);
        setStep(2);
      } else {
        setError(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setError(t('auth.errors.invalidOTP') || 'Invalid OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword.verifyOTP(phone, otp);
      if (response.success) {
        setStep(3);
      } else {
        setError(response.error || 'Invalid OTP');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError(t('auth.errors.passwordLength') || 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t('auth.errors.passwordMismatch') || 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await forgotPassword.resetPassword(phone, otp, newPassword);
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.error || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtp('');
    setStep(1);
    setError('');
    setOtpSent(false);
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
          {t('auth.passwordReset.successMessage') || 'Your password has been reset successfully. You can now log in with your new password.'}
        </p>
        <Link to="/login">
          <Button variant="primary" icon="login">
            {t('auth.login.button') || 'Go to Login'}
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">
          {step === 1 && (t('auth.forgotPassword.title') || 'Forgot Password')}
          {step === 2 && (t('auth.forgotPassword.verify') || 'Verify OTP')}
          {step === 3 && (t('auth.forgotPassword.reset') || 'Reset Password')}
        </h2>
        <p className="text-sage-600 dark:text-sage-400">
          {step === 1 && (t('auth.forgotPassword.subtitle') || 'Enter your phone number to receive a verification code')}
          {step === 2 && (t('auth.forgotPassword.verifySubtitle') || 'Enter the 6-digit code sent to your phone')}
          {step === 3 && (t('auth.forgotPassword.resetSubtitle') || 'Enter your new password')}
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

      {step === 1 && (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <Input
            label={t('auth.phone') || 'Phone Number'}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon="phone"
            placeholder="+267 71 234 567"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon="send"
          >
            {t('auth.sendOTP') || 'Send Verification Code'}
          </Button>

          <p className="text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              {t('auth.backToLogin') || 'Back to Login'}
            </Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <Input
            label={t('auth.otp') || 'Verification Code'}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            icon="pin"
            placeholder="123456"
            required
            fullWidth
            helper={t('auth.otpHelper') || 'Enter the 6-digit code sent to your phone'}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon="verified"
          >
            {t('auth.verifyOTP') || 'Verify Code'}
          </Button>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={handleResendOTP}
              className="text-sm text-primary hover:underline"
            >
              {t('auth.resendOTP') || "Didn't receive code? Resend"}
            </button>
            <div>
              <Link to="/login" className="text-sm text-primary hover:underline">
                {t('auth.backToLogin') || 'Back to Login'}
              </Link>
            </div>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          <div className="relative">
            <Input
              label={t('auth.newPassword') || 'New Password'}
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon="lock"
              placeholder="••••••••"
              required
              fullWidth
            />
          </div>

          <div className="relative">
            <Input
              label={t('auth.confirmPassword') || 'Confirm Password'}
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon="lock"
              placeholder="••••••••"
              required
              fullWidth
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            icon="lock_reset"
          >
            {t('auth.resetPassword') || 'Reset Password'}
          </Button>

          <p className="text-center">
            <Link to="/login" className="text-sm text-primary hover:underline">
              {t('auth.backToLogin') || 'Back to Login'}
            </Link>
          </p>
        </form>
      )}
    </Card>
  );
};

export default ForgotPassword;