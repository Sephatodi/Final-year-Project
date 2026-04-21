import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import Card from '../common/Card';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Account Info
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    
    // Farmer Info
    role: 'farmer',
    farmLocation: '',
    herdSize: '',
    
    // Expert Info (conditional)
    specialization: '',
    licenseNumber: '',
    region: '',
    
    // Terms
    agreeTerms: false,
    receiveUpdates: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setRegisterError('');
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.errors.nameRequired') || 'Full name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('auth.errors.phoneRequired') || 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('auth.errors.phoneInvalid') || 'Invalid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid') || 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired') || 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordLength') || 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch') || 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (formData.role === 'farmer') {
      if (!formData.farmLocation.trim()) {
        newErrors.farmLocation = t('auth.errors.locationRequired') || 'Farm location is required';
      }
    } else if (formData.role === 'expert') {
      if (!formData.specialization) {
        newErrors.specialization = t('auth.errors.specializationRequired') || 'Specialization is required';
      }
      if (!formData.licenseNumber) {
        newErrors.licenseNumber = t('auth.errors.licenseRequired') || 'License number is required';
      }
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = t('auth.errors.termsRequired') || 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsLoading(true);
    setRegisterError('');

    try {
      const response = await register(formData);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        setRegisterError(response.error || t('auth.errors.registrationFailed') || 'Registration failed');
      }
    } catch (error) {
      setRegisterError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const regionOptions = [
    { value: 'gaborone', label: 'Gaborone' },
    { value: 'francistown', label: 'Francistown' },
    { value: 'maun', label: 'Maun' },
    { value: 'molepolole', label: 'Molepolole' },
    { value: 'serowe', label: 'Serowe' },
    { value: 'kanye', label: 'Kanye' },
  ];

  const specializationOptions = [
    { value: 'cattle', label: 'Cattle Specialist' },
    { value: 'small_ruminants', label: 'Small Ruminants' },
    { value: 'mixed', label: 'Mixed Practice' },
    { value: 'surgery', label: 'Veterinary Surgeon' },
  ];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">{t('auth.register.title') || 'Join Farm-Aid Today'}</h2>
        <p className="text-sage-600 dark:text-sage-400">
          {t('auth.register.subtitle') || "Empowering Botswana's farmers with digital intelligence"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 1 ? 'bg-primary text-background-dark' : 'bg-sage-100 text-sage-400'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step > 1 ? 'bg-primary' : 'bg-sage-200'
          }`} />
        </div>
        <div className="flex items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            step >= 2 ? 'bg-primary text-background-dark' : 'bg-sage-100 text-sage-400'
          }`}>
            2
          </div>
        </div>
      </div>

      {registerError && (
        <Alert
          type="error"
          message={registerError}
          dismissible
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Account Information */}
        {step === 1 && (
          <div className="space-y-6">
            <Input
              label={t('auth.fullName') || 'Full Name'}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon="person"
              placeholder="Enter your full name"
              required
              fullWidth
            />

            <Input
              label={t('auth.phone') || 'Phone Number'}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              icon="phone"
              placeholder="+267 71 234 567"
              required
              fullWidth
            />

            <Input
              label={t('auth.email') || 'Email (optional)'}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon="email"
              placeholder="your@email.com"
              fullWidth
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
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
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

            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="primary"
                onClick={handleNext}
                icon="arrow_forward"
                iconPosition="right"
              >
                {t('common.next') || 'Next'}
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Profile Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-2">
                {t('auth.accountType') || 'I am a:'}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'farmer'
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="farmer"
                    checked={formData.role === 'farmer'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="material-icons-outlined text-2xl text-primary mb-2">pets</span>
                  <span className="font-medium">Farmer</span>
                </label>

                <label className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                  formData.role === 'expert'
                    ? 'border-primary bg-primary/5'
                    : 'border-sage-200 hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="expert"
                    checked={formData.role === 'expert'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="material-icons-outlined text-2xl text-primary mb-2">medical_services</span>
                  <span className="font-medium">Veterinarian/Expert</span>
                </label>
              </div>
            </div>

            {formData.role === 'farmer' && (
              <>
                <Input
                  label={t('auth.farmLocation') || 'Farm Location'}
                  name="farmLocation"
                  value={formData.farmLocation}
                  onChange={handleChange}
                  error={errors.farmLocation}
                  icon="location_on"
                  placeholder="e.g., Francistown, Central District"
                  required
                  fullWidth
                />

                <Input
                  label={t('auth.herdSize') || 'Herd Size (optional)'}
                  name="herdSize"
                  type="number"
                  value={formData.herdSize}
                  onChange={handleChange}
                  icon="pets"
                  placeholder="Number of animals"
                  fullWidth
                />
              </>
            )}

            {formData.role === 'expert' && (
              <>
                <Select
                  label={t('auth.specialization') || 'Specialization'}
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  error={errors.specialization}
                  options={specializationOptions}
                  placeholder="Select specialization"
                  required
                  fullWidth
                />

                <Input
                  label={t('auth.licenseNumber') || 'License Number'}
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  error={errors.licenseNumber}
                  icon="badge"
                  placeholder="e.g., VET-2024-001"
                  required
                  fullWidth
                />

                <Select
                  label={t('auth.region') || 'Region'}
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  options={regionOptions}
                  placeholder="Select your region"
                  fullWidth
                />
              </>
            )}

            <div className="space-y-3 pt-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-sage-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-sage-700 dark:text-sage-300">
                  {t('auth.agreeTerms') || 'I agree to the '}
                  <Link to="/terms" className="text-primary hover:underline">
                    {t('auth.termsOfService') || 'Terms of Service'}
                  </Link>
                  {' '}{t('auth.and') || 'and'}{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    {t('auth.privacyPolicy') || 'Privacy Policy'}
                  </Link>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="receiveUpdates"
                  checked={formData.receiveUpdates}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-sage-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-sage-700 dark:text-sage-300">
                  {t('auth.receiveUpdates') || 'I want to receive updates about diseases and market prices'}
                </span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleBack}
                icon="arrow_back"
              >
                {t('common.back') || 'Back'}
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                icon="how_to_reg"
                className="flex-1"
              >
                {t('auth.createAccount') || 'Create Account'}
              </Button>
            </div>
          </div>
        )}
      </form>

      <p className="mt-8 text-center text-sm text-sage-600 dark:text-sage-400">
        {t('auth.haveAccount') || 'Already have an account?'}{' '}
        <Link to="/login" className="text-primary font-bold hover:underline">
          {t('auth.login.button') || 'Log In'}
        </Link>
      </p>
    </Card>
  );
};

export default RegisterForm;