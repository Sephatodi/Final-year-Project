import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';
import BaitsTagInput from './BaitsTagInput';

const AddLivestockForm = ({ onSubmit, initialData = {}, isOfflineMode = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOffline } = useOffline();

  const [formData, setFormData] = useState({
    baitsTagNumber: '',
    name: '',
    species: 'cattle',
    breed: '',
    birthDate: '',
    gender: 'female',
    weight: '',
    damId: '',
    sireId: '',
    location: '',
    notes: '',
    ...initialData
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const speciesOptions = [
    { value: 'cattle', label: t('livestock.cattle') || 'Cattle' },
    { value: 'goat', label: t('livestock.goats') || 'Goat' },
    { value: 'sheep', label: t('livestock.sheep') || 'Sheep' },
  ];

  const genderOptions = [
    { value: 'female', label: t('livestock.female') || 'Female' },
    { value: 'male', label: t('livestock.male') || 'Male' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.baitsTagNumber) {
      newErrors.baitsTagNumber = t('livestock.errors.baitsRequired') || 'BAITS tag number is required';
    }

    if (!formData.species) {
      newErrors.species = t('livestock.errors.speciesRequired') || 'Species is required';
    }

    if (!formData.gender) {
      newErrors.gender = t('livestock.errors.genderRequired') || 'Gender is required';
    }

    if (formData.weight && (formData.weight < 0 || formData.weight > 2000)) {
      newErrors.weight = t('livestock.errors.invalidWeight') || 'Invalid weight';
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
      await onSubmit(formData);
      navigate('/herd');
    } catch (error) {
      setSubmitError(error.message || 'Failed to add animal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t('livestock.addAnimal') || 'Add New Animal'}
        </h2>
        <p className="text-sage-500">
          {t('livestock.addAnimalSubtitle') || 'Enter the details of your new livestock'}
        </p>
      </div>

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
          message={t('common.offlineSave') || 'You are offline. This animal will be saved locally and synced when online.'}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BAITS Tag */}
        <BaitsTagInput
          value={formData.baitsTagNumber}
          onChange={(value) => setFormData(prev => ({ ...prev, baitsTagNumber: value }))}
          error={errors.baitsTagNumber}
          required
        />

        {/* Animal Name (optional) */}
        <Input
          label={t('livestock.name') || 'Animal Name (optional)'}
          name="name"
          value={formData.name}
          onChange={handleChange}
          icon="badge"
          placeholder="e.g., Big Brownie"
          fullWidth
        />

        {/* Species and Breed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label={t('livestock.species') || 'Species'}
            name="species"
            value={formData.species}
            onChange={handleChange}
            options={speciesOptions}
            error={errors.species}
            required
            fullWidth
          />

          <Input
            label={t('livestock.breed') || 'Breed'}
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g., Brahman, Boer"
            fullWidth
          />
        </div>

        {/* Birth Date and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('livestock.birthDate') || 'Birth Date'}
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            icon="event"
            fullWidth
          />

          <Select
            label={t('livestock.gender') || 'Gender'}
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={genderOptions}
            error={errors.gender}
            required
            fullWidth
          />
        </div>

        {/* Weight */}
        <Input
          label={t('livestock.weight') || 'Weight (kg) - optional'}
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          error={errors.weight}
          icon="scale"
          placeholder="e.g., 450"
          fullWidth
        />

        {/* Parent Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('livestock.damId') || "Mother's BAITS Tag (optional)"}
            name="damId"
            value={formData.damId}
            onChange={handleChange}
            placeholder="e.g., BW-2019-1234"
            fullWidth
          />

          <Input
            label={t('livestock.sireId') || "Father's BAITS Tag (optional)"}
            name="sireId"
            value={formData.sireId}
            onChange={handleChange}
            placeholder="e.g., BW-2018-5678"
            fullWidth
          />
        </div>

        {/* Location */}
        <Input
          label={t('livestock.location') || 'Location on Farm (optional)'}
          name="location"
          value={formData.location}
          onChange={handleChange}
          icon="location_on"
          placeholder="e.g., North Pasture, Kraal 3"
          fullWidth
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {t('livestock.notes') || 'Additional Notes'}
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder={t('livestock.notesPlaceholder') || 'Any additional information about this animal...'}
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate('/herd')}
            fullWidth
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon="save"
            fullWidth
          >
            {isOffline 
              ? (t('common.saveOffline') || 'Save Offline')
              : (t('common.save') || 'Save Animal')}
          </Button>
        </div>
      </form>
    </Card>
  );
};

AddLivestockForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isOfflineMode: PropTypes.bool,
};

export default AddLivestockForm;