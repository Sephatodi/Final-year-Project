import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffline } from '../../hooks/useOffline';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import Alert from '../common/Alert';
import LivestockCard from './LivestockCard';
import LivestockTable from './LivestockTable';
import LivestockFilters from './LivestockFilters';

const LivestockList = ({ 
  livestock = [], 
  loading = false, 
  error = null,
  onRefresh,
  viewMode = 'table',
  onViewModeChange 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOffline } = useOffline();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivestock, setFilteredLivestock] = useState(livestock);
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    filterLivestock();
  }, [livestock, searchTerm, selectedSpecies, selectedStatus, sortBy]);

  const filterLivestock = () => {
    let filtered = [...livestock];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(animal => 
        animal.baitsTagNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply species filter
    if (selectedSpecies !== 'all') {
      filtered = filtered.filter(animal => animal.species === selectedSpecies);
    }

    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(animal => animal.healthStatus === selectedStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'name':
          return (a.name || a.baitsTagNumber).localeCompare(b.name || b.baitsTagNumber);
        case 'age':
          return (a.age || 0) - (b.age || 0);
        case 'status':
          return (a.healthStatus || '').localeCompare(b.healthStatus || '');
        default:
          return 0;
      }
    });

    setFilteredLivestock(filtered);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddAnimal = () => {
    navigate('/herd/add');
  };

  const stats = {
    total: livestock.length,
    cattle: livestock.filter(a => a.species === 'cattle').length,
    goats: livestock.filter(a => a.species === 'goat').length,
    sheep: livestock.filter(a => a.species === 'sheep').length,
    healthy: livestock.filter(a => a.healthStatus === 'healthy').length,
    sick: livestock.filter(a => a.healthStatus === 'sick').length,
    critical: livestock.filter(a => a.healthStatus === 'critical').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-display font-black tracking-tight text-sage-900 dark:text-white">
            {t('livestock.myHerd') || 'My Herd'}
          </h2>
          <p className="text-sage-500 dark:text-sage-400 mt-1">
            {t('livestock.totalAnimals') || 'Total animals'}: {stats.total}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isOffline && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-full">
              <span className="material-icons-outlined text-amber-600 dark:text-amber-400 text-sm">cloud_off</span>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                {t('common.offlineMode') || 'Offline Mode'}
              </span>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleAddAnimal}
            icon="add_circle"
          >
            {t('livestock.addAnimal') || 'Add Animal'}
          </Button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <span className="material-icons-outlined text-blue-600">pets</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('livestock.cattle') || 'Cattle'}</p>
              <p className="text-xl font-bold">{stats.cattle}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <span className="material-icons-outlined text-green-600">cruelty_free</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('livestock.goats') || 'Goats'}</p>
              <p className="text-xl font-bold">{stats.goats}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <span className="material-icons-outlined text-purple-600">agriculture</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('livestock.sheep') || 'Sheep'}</p>
              <p className="text-xl font-bold">{stats.sheep}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-lg">
              <span className="material-icons-outlined text-amber-600">health_and_safety</span>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('livestock.healthy') || 'Healthy'}</p>
              <p className="text-xl font-bold">{stats.healthy}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert
          type="error"
          message={error}
          dismissible
          onDismiss={onRefresh}
        />
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={t('livestock.searchPlaceholder') || 'Search by tag, breed, or name...'}
            value={searchTerm}
            onChange={handleSearch}
            icon="search"
            fullWidth
          />
        </div>

        <div className="flex gap-2">
          <LivestockFilters
            selectedSpecies={selectedSpecies}
            onSpeciesChange={setSelectedSpecies}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <div className="flex border border-sage-200 dark:border-sage-800 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange?.('table')}
              className={`p-2 ${viewMode === 'table' ? 'bg-primary text-white' : 'bg-white dark:bg-sage-900 text-sage-600'}`}
            >
              <span className="material-icons-outlined">table_rows</span>
            </button>
            <button
              onClick={() => onViewModeChange?.('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white dark:bg-sage-900 text-sage-600'}`}
            >
              <span className="material-icons-outlined">grid_view</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-sage-500">
        {t('livestock.showing') || 'Showing'} {filteredLivestock.length} {t('livestock.of') || 'of'} {livestock.length} {t('livestock.animals') || 'animals'}
      </p>

      {/* Livestock Display */}
      {filteredLivestock.length === 0 ? (
        <Card className="p-12 text-center">
          <span className="material-icons-outlined text-5xl text-sage-300 mb-4">pets</span>
          <h3 className="text-lg font-bold mb-2">{t('livestock.noAnimals') || 'No animals found'}</h3>
          <p className="text-sage-500 mb-6">
            {searchTerm 
              ? (t('livestock.noSearchResults') || 'No animals match your search criteria')
              : (t('livestock.addFirstAnimal') || 'Add your first animal to get started')}
          </p>
          <Button onClick={handleAddAnimal} icon="add_circle">
            {t('livestock.addAnimal') || 'Add Animal'}
          </Button>
        </Card>
      ) : (
        <>
          {viewMode === 'table' ? (
            <LivestockTable livestock={filteredLivestock} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLivestock.map(animal => (
                <LivestockCard key={animal.id} animal={animal} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

LivestockList.propTypes = {
  livestock: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onRefresh: PropTypes.func,
  viewMode: PropTypes.oneOf(['table', 'grid']),
  onViewModeChange: PropTypes.func,
};

export default LivestockList;