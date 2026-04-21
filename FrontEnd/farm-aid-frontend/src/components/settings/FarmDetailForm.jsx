import PropTypes from 'prop-types';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import Select from '../common/Select';

const FarmDetailsForm = ({ farm, onUpdate }) => {
  const { t } = useTranslation();
  const { updateFarm } = useAuth();

  const [formData, setFormData] = useState({
    farmName: farm?.farmName || '',
    registrationNumber: farm?.registrationNumber || '',
    farmSize: farm?.farmSize || '',
    farmSizeUnit: farm?.farmSizeUnit || 'hectares',
    location: farm?.location || '',
    coordinates: farm?.coordinates || '',
    primaryActivity: farm?.primaryActivity || 'mixed',
    yearsActive: farm?.yearsActive || '',
    employees: farm?.employees || '',
    certifications: farm?.certifications || [],
    waterSource: farm?.waterSource || '',
    electricity: farm?.electricity || 'yes',
    notes: farm?.notes || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [certInput, setCertInput] = useState('');

  const activityOptions = [
    { value: 'cattle', label: t('farm.cattle') || 'Cattle Ranching' },
    { value: 'dairy', label: t('farm.dairy') || 'Dairy Farming' },
    { value: 'mixed', label: t('farm.mixed') || 'Mixed Livestock' },
    { value: 'goat', label: t('farm.goat') || 'Goat Farming' },
    { value: 'sheep', label: t('farm.sheep') || 'Sheep Farming' },
  ];

  const waterSourceOptions = [
    { value: 'borehole', label: t('farm.borehole') || 'Borehole' },
    { value: 'river', label: t('farm.river') || 'River/Stream' },
    { value: 'dam', label: t('farm.dam') || 'Dam' },
    { value: 'municipal', label: t('farm.municipal') || 'Municipal Water' },
    { value: 'rainwater', label: t('farm.rainwater') || 'Rainwater Harvesting' },
  ];

  const electricityOptions = [
    { value: 'yes', label: t('common.yes') || 'Yes' },
    { value: 'no', label: t('common.no') || 'No' },
    { value: 'partial', label: t('farm.partial') || 'Partial' },
    { value: 'solar', label: t('farm.solar') || 'Solar Only' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddCertification = () => {
    if (certInput.trim() && !formData.certifications.includes(certInput.trim())) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, certInput.trim()]
      }));
      setCertInput('');
    }
  };

  const handleRemoveCertification = (cert) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c !== cert)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.farmName.trim()) {
      newErrors.farmName = t('farm.errors.nameRequired') || 'Farm name is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = t('farm.errors.locationRequired') || 'Farm location is required';
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
      await updateFarm(formData);
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
        <h2 className="text-2xl font-bold mb-6">{t('settings.farmDetails') || 'Farm Details'}</h2>

        {success && (
          <Alert
            type="success"
            message={t('farm.updated') || 'Farm details updated successfully!'}
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('farm.farmName') || 'Farm Name'}
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              error={errors.farmName}
              icon="agriculture"
              required
              fullWidth
            />

            <Input
              label={t('farm.registrationNumber') || 'Registration Number'}
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              icon="badge"
              placeholder="e.g., FARM-2024-001"
              fullWidth
            />
          </div>

          {/* Farm Size */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('farm.farmSize') || 'Farm Size'}
              name="farmSize"
              type="number"
              value={formData.farmSize}
              onChange={handleChange}
              icon="square_foot"
              fullWidth
            />

            <Select
              label={t('farm.unit') || 'Unit'}
              name="farmSizeUnit"
              value={formData.farmSizeUnit}
              onChange={handleChange}
              options={[
                { value: 'hectares', label: t('farm.hectares') || 'Hectares' },
                { value: 'acres', label: t('farm.acres') || 'Acres' },
                { value: 'square_km', label: t('farm.squareKm') || 'Square Kilometers' },
              ]}
              fullWidth
            />
          </div>

          {/* Location */}
          <Input
            label={t('farm.location') || 'Farm Location'}
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            icon="location_on"
            placeholder="e.g., Francistown, Central District"
            required
            fullWidth
          />

          {/* GPS Coordinates */}
          <Input
            label={t('farm.coordinates') || 'GPS Coordinates (optional)'
            }
            name="coordinates"
            value={formData.coordinates}
            onChange={handleChange}
            icon="gps_fixed"
            placeholder="e.g., -21.1234, 27.1234"
            fullWidth
          />

          {/* Primary Activity */}
          <Select
            label={t('farm.primaryActivity') || 'Primary Activity'}
            name="primaryActivity"
            value={formData.primaryActivity}
            onChange={handleChange}
            options={activityOptions}
            fullWidth
          />

          {/* Years Active and Employees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('farm.yearsActive') || 'Years Active'}
              name="yearsActive"
              type="number"
              value={formData.yearsActive}
              onChange={handleChange}
              icon="history"
              fullWidth
            />

            <Input
              label={t('farm.employees') || 'Number of Employees'}
              name="employees"
              type="number"
              value={formData.employees}
              onChange={handleChange}
              icon="people"
              fullWidth
            />
          </div>

          {/* Water Source */}
          <Select
            label={t('farm.waterSource') || 'Water Source'}
            name="waterSource"
            value={formData.waterSource}
            onChange={handleChange}
            options={waterSourceOptions}
            fullWidth
          />

          {/* Electricity */}
          <Select
            label={t('farm.electricity') || 'Electricity Access'}
            name="electricity"
            value={formData.electricity}
            onChange={handleChange}
            options={electricityOptions}
            fullWidth
          />

          {/* Certifications */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('farm.certifications') || 'Certifications'}
            </label>
            <div className="flex gap-2 mb-2">
              <Input
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder={t('farm.addCertification') || 'Add certification...'}
                fullWidth
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleAddCertification}
              >
                {t('common.add') || 'Add'}
              </Button>
            </div>

            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.certifications.map((cert, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-sage-100 dark:bg-sage-800 rounded-full text-sm"
                  >
                    {cert}
                    <button
                      type="button"
                      onClick={() => handleRemoveCertification(cert)}
                      className="ml-1 text-sage-500 hover:text-red-600"
                    >
                      <span className="material-icons-outlined text-sm">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('farm.notes') || 'Additional Notes'}
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder={t('farm.notesPlaceholder') || 'Any additional information about your farm...'}
            />
          </div>

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

FarmDetailsForm.propTypes = {
  farm: PropTypes.object,
  onUpdate: PropTypes.func,
};

export default FarmDetailsForm;