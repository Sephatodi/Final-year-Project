import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const LivestockTable = ({ livestock }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedRows, setSelectedRows] = useState([]);

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

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(livestock.map(a => a.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for:`, selectedRows);
    // Implement bulk actions
  };

  return (
    <Card className="overflow-hidden">
      {/* Bulk Actions Bar */}
      {selectedRows.length > 0 && (
        <div className="bg-primary/10 px-6 py-3 border-b border-primary/20 flex items-center justify-between">
          <span className="text-sm font-medium">
            {selectedRows.length} {t('livestock.selected') || 'selected'}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleBulkAction('vaccinate')}>
              {t('livestock.vaccinate') || 'Vaccinate'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleBulkAction('export')}>
              {t('common.export') || 'Export'}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedRows([])}>
              {t('common.clear') || 'Clear'}
            </Button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-sage-50 dark:bg-sage-900/20 text-sage-500 text-xs font-bold uppercase tracking-wider">
              <th className="px-6 py-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedRows.length === livestock.length}
                  onChange={handleSelectAll}
                  className="rounded border-sage-300 text-primary focus:ring-primary"
                />
              </th>
              <th className="px-6 py-4 text-left">{t('livestock.animal') || 'Animal'}</th>
              <th className="px-6 py-4 text-left">{t('livestock.type') || 'Type/Breed'}</th>
              <th className="px-6 py-4 text-left">{t('livestock.ageGender') || 'Age/Gender'}</th>
              <th className="px-6 py-4 text-left">{t('livestock.lastAction') || 'Last Action'}</th>
              <th className="px-6 py-4 text-left">{t('livestock.healthStatus') || 'Health Status'}</th>
              <th className="px-6 py-4 text-right">{t('common.actions') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sage-100 dark:divide-sage-800">
            {livestock.map(animal => (
              <tr 
                key={animal.id} 
                className="hover:bg-sage-50/50 dark:hover:bg-sage-900/10 transition-colors cursor-pointer"
                onClick={() => navigate(`/herd/${animal.id}`)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(animal.id)}
                    onChange={() => handleSelectRow(animal.id)}
                    className="rounded border-sage-300 text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      animal.healthStatus === 'healthy' ? 'bg-green-100 dark:bg-green-900/20' :
                      animal.healthStatus === 'sick' ? 'bg-amber-100 dark:bg-amber-900/20' :
                      'bg-red-100 dark:bg-red-900/20'
                    }`}>
                      <span className={`material-icons-outlined ${
                        animal.healthStatus === 'healthy' ? 'text-green-600' :
                        animal.healthStatus === 'sick' ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {getSpeciesIcon(animal.species)}
                      </span>
                    </div>
                    <span className="text-sm font-bold">{animal.baitsTagNumber}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium capitalize">{animal.species}</div>
                  <div className="text-xs text-sage-500">{animal.breed || 'Mixed'}</div>
                </td>
                <td className="px-6 py-4">
                  {animal.birthDate ? (
                    <>
                      <div className="text-sm">
                        {Math.floor((new Date() - new Date(animal.birthDate)) / (1000 * 60 * 60 * 24 * 365))} yrs
                      </div>
                      <div className="text-xs text-sage-500 capitalize">{animal.gender}</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm">Unknown</div>
                      <div className="text-xs text-sage-500 capitalize">{animal.gender}</div>
                    </>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {animal.lastHealthEvent || '—'}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusColor(animal.healthStatus)} size="sm">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        animal.healthStatus === 'healthy' ? 'bg-green-500' :
                        animal.healthStatus === 'sick' ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}></span>
                      {animal.healthStatus}
                    </span>
                  </Badge>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="p-2 hover:bg-sage-100 dark:hover:bg-sage-800 rounded-lg transition-colors">
                    <span className="material-icons-outlined text-sage-500">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800 flex items-center justify-between">
        <p className="text-sm text-sage-500">
          {t('livestock.showing') || 'Showing'} 1 to {livestock.length} of {livestock.length} {t('livestock.entries') || 'entries'}
        </p>
        
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded border border-sage-200 dark:border-sage-800 text-sage-500 hover:bg-sage-100 dark:hover:bg-sage-800 disabled:opacity-50" disabled>
            <span className="material-icons-outlined text-sm">chevron_left</span>
          </button>
          <button className="px-3 py-1 rounded bg-primary text-white text-sm font-bold">1</button>
          <button className="px-3 py-1 rounded border border-sage-200 dark:border-sage-800 text-sage-500 hover:bg-sage-100 dark:hover:bg-sage-800">2</button>
          <button className="px-3 py-1 rounded border border-sage-200 dark:border-sage-800 text-sage-500 hover:bg-sage-100 dark:hover:bg-sage-800">
            <span className="material-icons-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

LivestockTable.propTypes = {
  livestock: PropTypes.array.isRequired,
};

export default LivestockTable;