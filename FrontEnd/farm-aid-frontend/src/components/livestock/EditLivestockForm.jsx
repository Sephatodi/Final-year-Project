import React, { useState, useEffect } from 'react';
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

const EditLivestockForm = ({ animal, onSubmit, onDelete }) => {
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
    healthStatus: 'healthy',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (animal) {
      setFormData({
        baitsTagNumber: animal.baitsTagNumber || '',
        name: animal.name || '',
        species: animal.species || 'cattle',
        breed: animal.breed || '',
        birthDate: animal.birthDate || '',
        gender: animal.gender || 'female',
        weight: animal.weight || '',
        damId: animal.damId || '',
        sireId: animal.sireId || '',
        location: animal.location || '',
        notes: animal.notes || '',
        healthStatus: animal.healthStatus || 'healthy',
      });
    }
  }, [animal]);

  const speciesOptions = [
    { value: 'cattle', label: t('livestock.cattle') || 'Cattle' },
    { value: 'goat', label: t('livestock.goats') || 'Goat' },
    { value: 'sheep', label: t('livestock.sheep') || 'Sheep' },
  ];

  const genderOptions = [
    { value: 'female', label: t('livestock.female') || 'Female' },
    { value: 'male', label: t('livestock.male') || 'Male' },
  ];

  const healthStatusOptions = [
    { value: 'healthy', label: t('livestock.healthy') || 'Healthy' },
    { value: 'sick', label: t('livestock.sick') || 'Sick' },
    { value: 'critical', label: t('livestock.critical') || 'Critical' },
    { value: 'recovering', label: t('livestock.recovering') || 'Recovering' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      setSubmitError(error.message || 'Failed to update animal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(animal.id);
      navigate('/herd');
    } catch (error) {
      setSubmitError(error.message || 'Failed to delete animal');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (!animal) {
    return (
      <Card className="p-12 text-center">
        <Alert type="error" message={t('livestock.notFound') || 'Animal not found'} />
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {t('livestock.editAnimal') || 'Edit Animal'}
        </h2>
        <p className="text-sage-500">
          {t('livestock.editAnimalSubtitle') || 'Update information for'} {animal.baitsTagNumber}
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
          message={t('common.offlineEdit') || 'You are offline. Changes will be saved locally and synced when online.'}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BAITS Tag (read-only) */}
        <BaitsTagInput
          value={formData.baitsTagNumber}
          onChange={(value) => setFormData(prev => ({ ...prev, baitsTagNumber: value }))}
          error={errors.baitsTagNumber}
          required
          readOnly
        />

        {/* Animal Name */}
        <Input
          label={t('livestock.name') || 'Animal Name (optional)'}
          name="name"
          value={formData.name}
          onChange={handleChange}
          icon="badge"
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
            fullWidth
          />
        </div>

        {/* Weight and Health Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('livestock.weight') || 'Weight (kg)'
            }
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleChange}
            icon="scale"
            fullWidth
          />

          <Select
            label={t('livestock.healthStatus') || 'Health Status'}
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleChange}
            options={healthStatusOptions}
            fullWidth
          />
        </div>

        {/* Parent Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t('livestock.damId') || "Mother's BAITS Tag"}
            name="damId"
            value={formData.damId}
            onChange={handleChange}
            fullWidth
          />

          <Input
            label={t('livestock.sireId') || "Father's BAITS Tag"}
            name="sireId"
            value={formData.sireId}
            onChange={handleChange}
            fullWidth
          />
        </div>

        {/* Location */}
        <Input
          label={t('livestock.location') || 'Location on Farm'}
          name="location"
          value={formData.location}
          onChange={handleChange}
          icon="location_on"
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
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => navigate(`/herd/${animal.id}`)}
            icon="arrow_back"
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            icon="save"
            className="flex-1"
          >
            {t('common.saveChanges') || 'Save Changes'}
          </Button>

          <Button
            type="button"
            variant="danger"
            size="lg"
            onClick={() => setShowDeleteConfirm(true)}
            icon="delete"
            className="flex-1"
          >
            {t('common.delete') || 'Delete'}
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-icons-outlined text-3xl text-red-600">warning</span>
              </div>
              <h3 className="text-xl font-bold mb-2">
                {t('common.confirmDelete') || 'Confirm Delete'}
              </h3>
              <p className="text-sage-500">
                {t('livestock.deleteWarning') || 'Are you sure you want to delete this animal? This action cannot be undone.'}
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setShowDeleteConfirm(false)}
              >
                {t('common.cancel') || 'Cancel'}
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={handleDelete}
                loading={isDeleting}
              >
                {t('common.delete') || 'Delete'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};

EditLivestockForm.propTypes = {
  animal: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default EditLivestockForm;