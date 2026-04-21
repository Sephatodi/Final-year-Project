import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const { t } = useTranslation();

  const categories = [
    { id: 'all', label: t('categories.all') || 'All', icon: 'apps' },
    { id: 'disease', label: t('categories.disease') || 'Diseases', icon: 'coronavirus' },
    { id: 'prevention', label: t('categories.prevention') || 'Prevention', icon: 'shield' },
    { id: 'treatment', label: t('categories.treatment') || 'Treatment', icon: 'medical_services' },
    { id: 'nutrition', label: t('categories.nutrition') || 'Nutrition', icon: 'restaurant' },
    { id: 'breeding', label: t('categories.breeding') || 'Breeding', icon: 'pets' },
    { id: 'management', label: t('categories.management') || 'Management', icon: 'manage_accounts' },
  ];

  const species = [
    { id: 'cattle', label: t('species.cattle') || 'Cattle', icon: 'pets' },
    { id: 'goat', label: t('species.goat') || 'Goat', icon: 'cruelty_free' },
    { id: 'sheep', label: t('species.sheep') || 'Sheep', icon: 'agriculture' },
  ];

  return (
    <div className="space-y-4">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-sage-900 border border-sage-200 dark:border-sage-800 hover:border-primary hover:text-primary'
            }`}
          >
            <span className="material-icons-outlined text-sm">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Species Quick Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-sage-500">{t('common.filterBy') || 'Filter by:'}</span>
        {species.map(s => (
          <button
            key={s.id}
            onClick={() => onCategoryChange(s.id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
              selectedCategory === s.id
                ? 'bg-primary text-white'
                : 'bg-sage-100 dark:bg-sage-800 hover:bg-primary/10'
            }`}
          >
            <span className="material-icons-outlined text-xs">{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
};

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string,
  onCategoryChange: PropTypes.func.isRequired,
};

export default CategoryFilter;