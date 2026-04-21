import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';

const SpeciesSelector = ({ selectedSpecies, onSelect }) => {
  const { t } = useTranslation();

  const species = [
    {
      id: 'cattle',
      icon: 'pets',
      label: t('species.cattle') || 'Cattle',
      description: t('species.cattleDesc') || 'Bovine',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'goat',
      icon: 'cruelty_free',
      label: t('species.goat') || 'Goat',
      description: t('species.goatDesc') || 'Caprine',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'sheep',
      icon: 'agriculture',
      label: t('species.sheep') || 'Sheep',
      description: t('species.sheepDesc') || 'Ovine',
      color: 'from-purple-500 to-purple-600'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-sage-900 dark:text-white mb-2">
          {t('symptomChecker.selectSpecies') || 'Select Animal Species'}
        </h3>
        <p className="text-sm text-sage-500">
          {t('symptomChecker.speciesSubtitle') || 'Choose the type of animal showing symptoms'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {species.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`relative group overflow-hidden rounded-xl transition-all duration-300 ${
              selectedSpecies === s.id 
                ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-background-dark scale-105' 
                : 'hover:scale-102'
            }`}
          >
            <Card className={`p-6 bg-gradient-to-br ${s.color} text-white border-0 ${
              selectedSpecies === s.id ? 'shadow-xl' : 'shadow-md'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative z-10 flex flex-col items-center">
                <span className="material-icons-outlined text-5xl mb-3 group-hover:scale-110 transition-transform">
                  {s.icon}
                </span>
                <h4 className="text-xl font-bold mb-1">{s.label}</h4>
                <p className="text-sm text-white/80">{s.description}</p>
                
                {selectedSpecies === s.id && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="material-icons-outlined text-sm text-primary">check</span>
                  </div>
                )}
              </div>
            </Card>
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm">
        <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
          <span className="block font-bold text-primary">15+</span>
          <span className="text-sage-500">{t('symptomChecker.commonDiseases') || 'Common Diseases'}</span>
        </div>
        <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
          <span className="block font-bold text-primary">92%</span>
          <span className="text-sage-500">{t('symptomChecker.accuracy') || 'AI Accuracy'}</span>
        </div>
        <div className="p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
          <span className="block font-bold text-primary">24/7</span>
          <span className="text-sage-500">{t('symptomChecker.available') || 'Available Offline'}</span>
        </div>
      </div>
    </div>
  );
};

SpeciesSelector.propTypes = {
  selectedSpecies: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default SpeciesSelector;