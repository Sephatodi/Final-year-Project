import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Button from '../common/Button';
import Card from '../common/Card';

const LivestockFilters = ({
  selectedSpecies,
  onSpeciesChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const speciesOptions = [
    { value: 'all', label: t('livestock.allSpecies') || 'All Species' },
    { value: 'cattle', label: t('livestock.cattle') || 'Cattle' },
    { value: 'goat', label: t('livestock.goats') || 'Goats' },
    { value: 'sheep', label: t('livestock.sheep') || 'Sheep' },
  ];

  const statusOptions = [
    { value: 'all', label: t('livestock.allStatus') || 'All Status' },
    { value: 'healthy', label: t('livestock.healthy') || 'Healthy' },
    { value: 'sick', label: t('livestock.sick') || 'Sick' },
    { value: 'critical', label: t('livestock.critical') || 'Critical' },
    { value: 'recovering', label: t('livestock.recovering') || 'Recovering' },
  ];

  const sortOptions = [
    { value: 'name', label: t('livestock.sortByName') || 'Name' },
    { value: 'age', label: t('livestock.sortByAge') || 'Age' },
    { value: 'status', label: t('livestock.sortByStatus') || 'Health Status' },
    { value: 'recent', label: t('livestock.sortByRecent') || 'Most Recent' },
  ];

  const clearFilters = () => {
    onSpeciesChange('all');
    onStatusChange('all');
    onSortChange('name');
  };

  const hasActiveFilters = selectedSpecies !== 'all' || selectedStatus !== 'all';

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        icon="filter_list"
        badge={hasActiveFilters ? 'active' : null}
      >
        {t('common.filters') || 'Filters'}
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Filter Panel */}
          <Card className="absolute right-0 mt-2 w-80 z-50 p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold">{t('common.filters') || 'Filters'}</h4>
              <button onClick={() => setIsOpen(false)}>
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            {/* Species Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {t('livestock.species') || 'Species'}
              </label>
              <div className="space-y-2">
                {speciesOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="species"
                      value={option.value}
                      checked={selectedSpecies === option.value}
                      onChange={(e) => onSpeciesChange(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                {t('livestock.healthStatus') || 'Health Status'}
              </label>
              <div className="space-y-2">
                {statusOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="status"
                      value={option.value}
                      checked={selectedStatus === option.value}
                      onChange={(e) => onStatusChange(e.target.value)}
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                {t('common.sortBy') || 'Sort By'}
              </label>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full p-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                fullWidth
                onClick={clearFilters}
              >
                {t('common.clear') || 'Clear'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setIsOpen(false)}
              >
                {t('common.apply') || 'Apply'}
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

LivestockFilters.propTypes = {
  selectedSpecies: PropTypes.string,
  onSpeciesChange: PropTypes.func.isRequired,
  selectedStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
};

export default LivestockFilters;