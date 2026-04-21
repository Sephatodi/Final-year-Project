import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';

const ProfileForm = ({ user, onUpdate, loading = false }) => {
  const { t } = useTranslation();
  const { updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profileImage: user?.profileImage || null,
    language: user?.language || 'en',
    bio: user?.bio || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || 'Botswana',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.profileImage || null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profileImage: t('settings.imageTooLarge') || 'Image must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = t('settings.errors.nameRequired') || 'Full name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('settings.errors.invalidEmail') || 'Invalid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('settings.errors.phoneRequired') || 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccess(false);

    try {
      await updateProfile(formData);
      if (onUpdate) {
        onUpdate(formData);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">{t('settings.profile') || 'Profile Information'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('settings.profileUpdated') || 'Profile updated successfully!'}
            className="mb-6"
            dismissible
            autoDismiss
          />
        )}

        {errors.submit && (
          <Alert
            type="error"
            message={errors.submit}
            className="mb-6"
            dismissible
            onDismiss={() => setErrors(prev => ({ ...prev, submit: null }))}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-sage-100 dark:bg-sage-800">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-icons-outlined text-4xl text-sage-400">person</span>
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-image"
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-dark transition-colors"
              >
                <span className="material-icons-outlined text-white text-sm">photo_camera</span>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <p className="font-medium">{t('settings.profilePhoto') || 'Profile Photo'}</p>
              <p className="text-sm text-sage-500">
                {t('settings.photoHelp') || 'JPG, PNG or GIF. Max 5MB.'}
              </p>
              {errors.profileImage && (
                <p className="text-sm text-red-600 mt-1">{errors.profileImage}</p>
              )}
            </div>
          </div>

          {/* Full Name */}
          <Input
            label={t('settings.fullName') || 'Full Name'}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            icon="person"
            required
            fullWidth
          />

          {/* Email */}
          <Input
            label={t('settings.email') || 'Email Address'}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon="email"
            fullWidth
          />

          {/* Phone */}
          <Input
            label={t('settings.phone') || 'Phone Number'}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            icon="phone"
            required
            fullWidth
          />

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.bio') || 'Bio'}
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder={t('settings.bioPlaceholder') || 'Tell us a bit about yourself...'}
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('settings.address') || 'Address'}
              name="address"
              value={formData.address}
              onChange={handleChange}
              icon="location_on"
              fullWidth
            />
            <Input
              label={t('settings.city') || 'City'}
              name="city"
              value={formData.city}
              onChange={handleChange}
              icon="location_city"
              fullWidth
            />
          </div>

          {/* Country */}
          <Input
            label={t('settings.country') || 'Country'}
            name="country"
            value={formData.country}
            onChange={handleChange}
            icon="public"
            fullWidth
          />

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              icon="save"
              fullWidth
            >
              {t('common.saveChanges') || 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  onUpdate: PropTypes.func,
  loading: PropTypes.bool,
};

export default ProfileForm;