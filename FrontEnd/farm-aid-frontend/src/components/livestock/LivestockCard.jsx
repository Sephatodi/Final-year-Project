import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Badge from '../common/Badge';

const LivestockCard = ({ animal }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch(status) {
      case 'healthy': return 'success';
      case 'sick': return 'warning';
      case 'critical': return 'critical';
      case 'recovering': return 'info';
      default: return 'default';
    }
  };

  const getSpeciesIcon = (species) => {
    switch(species) {
      case 'cattle': return 'pets';
      case 'goat': return 'cruelty_free';
      case 'sheep': return 'agriculture';
      default: return 'pets';
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    const age = Math.floor((new Date() - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 365));
    return `${age} ${t('common.years') || 'yrs'}`;
  };

  return (
    <Card 
      className="p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => navigate(`/herd/${animal.id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            animal.healthStatus === 'healthy' ? 'bg-green-100 dark:bg-green-900/20' :
            animal.healthStatus === 'sick' ? 'bg-amber-100 dark:bg-amber-900/20' :
            animal.healthStatus === 'critical' ? 'bg-red-100 dark:bg-red-900/20' :
            'bg-sage-100 dark:bg-sage-800'
          }`}>
            <span className={`material-icons-outlined text-2xl ${
              animal.healthStatus === 'healthy' ? 'text-green-600' :
              animal.healthStatus === 'sick' ? 'text-amber-600' :
              animal.healthStatus === 'critical' ? 'text-red-600' :
              'text-sage-600'
            }`}>
              {getSpeciesIcon(animal.species)}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{animal.name || animal.baitsTagNumber}</h3>
            <p className="text-sm text-sage-500">{animal.breed || 'Mixed Breed'}</p>
          </div>
        </div>
        <Badge variant={getStatusColor(animal.healthStatus)}>
          {animal.healthStatus}
        </Badge>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-sage-500 mb-1">{t('livestock.tag') || 'BAITS Tag'}</p>
          <p className="text-sm font-medium">{animal.baitsTagNumber}</p>
        </div>
        <div>
          <p className="text-xs text-sage-500 mb-1">{t('livestock.age') || 'Age'}</p>
          <p className="text-sm font-medium">{calculateAge(animal.birthDate)}</p>
        </div>
        <div>
          <p className="text-xs text-sage-500 mb-1">{t('livestock.gender') || 'Gender'}</p>
          <p className="text-sm font-medium capitalize">{animal.gender}</p>
        </div>
        <div>
          <p className="text-xs text-sage-500 mb-1">{t('livestock.weight') || 'Weight'}</p>
          <p className="text-sm font-medium">{animal.weight || '—'} kg</p>
        </div>
      </div>

      {/* Last Action */}
      {animal.lastHealthEvent && (
        <div className="pt-4 border-t border-sage-100 dark:border-sage-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-icons-outlined text-sm text-sage-400">event</span>
              <span className="text-xs text-sage-500">
                {t('livestock.lastAction') || 'Last action'}:
              </span>
            </div>
            <span className="text-xs font-medium">{animal.lastHealthEvent}</span>
          </div>
        </div>
      )}

      {/* Hover Actions */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
        <div className="bg-white dark:bg-sage-900 rounded-lg shadow-lg p-2">
          <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg">
            <span className="material-icons-outlined text-primary">visibility</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

LivestockCard.propTypes = {
  animal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    baitsTagNumber: PropTypes.string,
    name: PropTypes.string,
    species: PropTypes.string,
    breed: PropTypes.string,
    birthDate: PropTypes.string,
    gender: PropTypes.string,
    weight: PropTypes.number,
    healthStatus: PropTypes.string,
    lastHealthEvent: PropTypes.string,
  }).isRequired,
};

export default LivestockCard;