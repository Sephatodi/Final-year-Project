import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Alert from '../common/Alert';

const AddHealthRecord = ({ animalId, animalName, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const { isOffline } = useOffline();

  const [formData, setFormData] = useState({
    type: 'checkup',
    date: new Date().toISOString().split('T')[0],
    title: '',
    description: '',
    performedBy: '',
    medications: [],
    followUp: '',
    notes: '',
  });

  const [medicationInput, setMedicationInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recordTypeOptions = [
    { value: 'checkup', label: t('healthRecords.checkup') || 'Regular Checkup' },
    { value: 'vaccination', label: t('healthRecords.vaccination') || 'Vaccination' },
    { value: 'treatment', label: t('healthRecords.treatment') || 'Treatment' },
    { value: 'surgery', label: t('healthRecords.surgery') || 'Surgery' },
    { value: 'deworming', label: t('healthRecords.deworming') || 'Deworming' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddMedication = () => {
    if (medicationInput.trim()) {
      setFormData(prev => ({
        ...prev,
        medications: [...prev.medications, medicationInput.trim()]
      }));
      setMedicationInput('');
    }
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title) {
      newErrors.title = t('healthRecords.errors.titleRequired') || 'Title is required';
    }

    if (!formData.date) {
      newErrors.date = t('healthRecords.errors.dateRequired') || 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        animalId,
        createdAt: new Date().toISOString()
      });
      onClose();
    } catch (error) {
      console.error('Failed to add health record:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">
                {t('healthRecords.addRecord') || 'Add Health Record'}
              </h2>
              <p className="text-sage-500 mt-1">
                {t('healthRecords.forAnimal') || 'For'}: {animalName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>

          {isOffline && (
            <Alert
              type="warning"
              message={t('common.offlineSave') || 'You are offline. This record will be saved locally and synced when online.'}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Record Type */}
            <Select
              label={t('healthRecords.recordType') || 'Record Type'}
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={recordTypeOptions}
              required
              fullWidth
            />

            {/* Date */}
            <Input
              label={t('healthRecords.date') || 'Date'}
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
              required
              fullWidth
            />

            {/* Title */}
            <Input
              label={t('healthRecords.title') || 'Title'}
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="e.g., Annual Vaccination, Injury Treatment"
              required
              fullWidth
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('healthRecords.description') || 'Description'}
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={t('healthRecords.descriptionPlaceholder') || 'Describe the procedure, symptoms, or treatment...'}
              />
            </div>

            {/* Performed By */}
            <Input
              label={t('healthRecords.performedBy') || 'Performed By'}
              name="performedBy"
              value={formData.performedBy}
              onChange={handleChange}
              icon="person"
              placeholder="e.g., Dr. Molefe, Self"
              fullWidth
            />

            {/* Medications */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('healthRecords.medications') || 'Medications'}
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={medicationInput}
                  onChange={(e) => setMedicationInput(e.target.value)}
                  placeholder={t('healthRecords.addMedication') || 'Add medication...'}
                  fullWidth
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddMedication}
                >
                  {t('common.add') || 'Add'}
                </Button>
              </div>
              {formData.medications.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medications.map((med, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-sage-100 dark:bg-sage-800 rounded-full text-sm"
                    >
                      {med}
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(index)}
                        className="ml-1 text-sage-500 hover:text-red-600"
                      >
                        <span className="material-icons-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-up Date */}
            <Input
              label={t('healthRecords.followUp') || 'Follow-up Date (optional)'}
              name="followUp"
              type="date"
              value={formData.followUp}
              onChange={handleChange}
              icon="event"
              fullWidth
            />

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('healthRecords.additionalNotes') || 'Additional Notes'}
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900/20 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={t('healthRecords.notesPlaceholder') || 'Any additional information...'}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={onClose}
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
                {t('common.save') || 'Save Record'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

AddHealthRecord.propTypes = {
  animalId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  animalName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default AddHealthRecord;