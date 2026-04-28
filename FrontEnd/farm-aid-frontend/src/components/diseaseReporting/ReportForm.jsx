import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import { useGeolocation } from '../../hooks/useGeolocation';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import LocationPicker from './LocationPicker';
import PhotoGallery from './PhotoGallery';

const ReportForm = ({ initialData = {}, onSubmit, isOfflineMode = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOffline } = useOffline();
  const { latitude, longitude, error: geoError, getLocation } = useGeolocation();

  const [formData, setFormData] = useState({
    location: '',
    locationCoords: null,
    description: '',
    species: 'cattle',
    animalCount: 1,
    symptoms: [],
    suspectedDisease: '',
    photos: [],
    urgent: false,
    reporterName: '',
    reporterPhone: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [symptomInput, setSymptomInput] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const speciesOptions = [
    { value: 'cattle', label: t('species.cattle') || 'Cattle' },
    { value: 'goat', label: t('species.goat') || 'Goat' },
    { value: 'sheep', label: t('species.sheep') || 'Sheep' },
    { value: 'mixed', label: t('species.mixed') || 'Mixed Herd' },
  ];

  const diseaseOptions = [
    { value: 'fmd', label: 'Foot and Mouth Disease' },
    { value: 'heartwater', label: 'Heartwater' },
    { value: 'anthrax', label: 'Anthrax' },
    { value: 'rabies', label: 'Rabies' },
    { value: 'lsd', label: 'Lumpy Skin Disease' },
    { value: 'cbpp', label: 'CBPP' },
    { value: 'other', label: t('common.other') || 'Other' },
  ];

  useEffect(() => {
    if (initialData.symptoms) {
      setFormData(prev => ({
        ...prev,
        symptoms: Array.isArray(initialData.symptoms) 
          ? initialData.symptoms 
          : initialData.symptoms.split(',').map(s => s.trim())
      }));
    }
  }, [initialData]);

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    const coords = await getLocation();
    if (coords) {
      setFormData(prev => ({
        ...prev,
        locationCoords: coords,
        location: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
      }));
    }
    setDetectingLocation(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddSymptom = () => {
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, symptomInput.trim()]
      }));
      setSymptomInput('');
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.filter(s => s !== symptom)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.location) {
      newErrors.location = t('report.errors.locationRequired') || 'Location is required';
    }

    if (!formData.description) {
      newErrors.description = t('report.errors.descriptionRequired') || 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = t('report.errors.descriptionTooShort') || 'Please provide more detail (at least 20 characters)';
    }

    if (formData.animalCount < 1) {
      newErrors.animalCount = t('report.errors.invalidCount') || 'Number of animals must be at least 1';
    }

    if (formData.symptoms.length === 0) {
      newErrors.symptoms = t('report.errors.symptomsRequired') || 'At least one symptom is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const reportData = {
        ...formData,
        reportId: `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        submittedAt: new Date().toISOString(),
        status: isOffline ? 'pending' : 'submitted'
      };

      await onSubmit(reportData);
    } catch (error) {
      setSubmitError(error.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFMD = formData.suspectedDisease === 'fmd' || 
    formData.description.toLowerCase().includes('fmd') ||
    formData.description.toLowerCase().includes('foot and mouth');

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t('report.title') || 'Report Suspected Disease'}
        </h2>
        <p className="text-sage-500">
          {t('report.subtitle') || 'Submit a report to the Department of Veterinary Services'}
        </p>
      </div>

      {/* FMD Warning */}
      {isFMD && (
        <Alert
          type="critical"
          title={t('report.fmdWarning') || '⚠️ FMD SUSPECTED'}
          message={t('report.fmdMessage') || 'This is a notifiable disease. Report immediately and do not move animals.'}
          className="mb-6"
        />
      )}

      {submitError && (
        <Alert
          type="error"
          message={submitError}
          dismissible
          onDismiss={() => setSubmitError('')}
          className="mb-6"
        />
      )}

      {isOffline && (
        <Alert
          type="warning"
          message={t('report.offlineSave') || 'You are offline. This report will be saved locally and submitted when you are online.'}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Location Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium">
            {t('report.location') || 'Location'} <span className="text-red-500">*</span>
          </label>
          
          <LocationPicker
            location={formData.location}
            onLocationChange={(loc, coords) => setFormData(prev => ({ 
              ...prev, 
              location: loc,
              locationCoords: coords 
            }))}
            error={errors.location}
            detecting={detectingLocation}
            onDetect={handleDetectLocation}
          />

          {geoError && (
            <p className="text-xs text-amber-600">{geoError}</p>
          )}
        </div>

        {/* Species and Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label={t('report.species') || 'Species Affected'}
            name="species"
            value={formData.species}
            onChange={handleChange}
            options={speciesOptions}
            required
            fullWidth
          />

          <Input
            label={t('report.animalCount') || 'Number of Animals'}
            name="animalCount"
            type="number"
            min="1"
            value={formData.animalCount}
            onChange={handleChange}
            error={errors.animalCount}
            required
            fullWidth
          />
        </div>

        {/* Suspected Disease */}
        <Select
          label={t('report.suspectedDisease') || 'Suspected Disease (if known)'}
          name="suspectedDisease"
          value={formData.suspectedDisease}
          onChange={handleChange}
          options={diseaseOptions}
          fullWidth
        />

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('report.symptoms') || 'Observed Symptoms'} <span className="text-red-500">*</span>
          </label>
          
          <div className="flex gap-2 mb-2">
            <Input
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder={t('report.addSymptom') || 'e.g., lameness, salivation'}
              fullWidth
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddSymptom}
            >
              {t('common.add') || 'Add'}
            </Button>
          </div>

          {errors.symptoms && (
            <p className="text-sm text-red-600 mt-1">{errors.symptoms}</p>
          )}

          {formData.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-sage-100 dark:bg-sage-800 rounded-full text-sm"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(symptom)}
                    className="text-sage-500 hover:text-red-600"
                  >
                    <span className="material-icons-outlined text-sm">close</span>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('report.description') || 'Detailed Description'} <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={`w-full p-3 rounded-lg border ${
              errors.description 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-sage-200 dark:border-sage-800 focus:ring-primary focus:border-primary'
            } bg-white dark:bg-sage-900/20 transition-all`}
            placeholder={t('report.descriptionPlaceholder') || 'Describe what you observed: when it started, how animals are acting, any visible signs...'}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description}</p>
          )}
          <p className="text-xs text-sage-500 mt-1">
            {formData.description.length}/500 {t('report.characters') || 'characters'}
          </p>
        </div>

        {/* Photos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('report.photos') || 'Photos (optional)'}
          </label>
          <PhotoGallery
            photos={formData.photos}
            onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
            maxPhotos={5}
          />
        </div>

        {/* Reporter Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-sage-200 dark:border-sage-800">
          <Input
            label={t('report.reporterName') || 'Your Name'}
            name="reporterName"
            value={formData.reporterName}
            onChange={handleChange}
            icon="person"
            fullWidth
          />

          <Input
            label={t('report.reporterPhone') || 'Phone Number'}
            name="reporterPhone"
            value={formData.reporterPhone}
            onChange={handleChange}
            icon="phone"
            placeholder="+267 71 234 567"
            fullWidth
          />
        </div>

        {/* Urgent Checkbox */}
        <label className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg cursor-pointer">
          <input
            type="checkbox"
            name="urgent"
            checked={formData.urgent}
            onChange={handleChange}
            className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
          />
          <div>
            <span className="font-medium text-amber-800 dark:text-amber-300">
              {t('report.markUrgent') || 'Mark as Urgent'}
            </span>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {t('report.urgentNote') || 'Use for suspected notifiable diseases or emergencies'}
            </p>
          </div>
        </label>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate(-1)}
            fullWidth
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant={isFMD ? 'danger' : 'primary'}
            size="lg"
            loading={isSubmitting}
            icon={isOffline ? 'save' : 'send'}
            fullWidth
          >
            {isOffline 
              ? (t('report.saveOffline') || 'Save Offline')
              : (t('report.submit') || 'Submit Report')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

ReportForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isOfflineMode: PropTypes.bool,
};

export default ReportForm;