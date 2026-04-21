import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import HealthRecordsList from './HealthRecordsList';
import AddHealthRecord from './AddHealthRecord';

const LivestockDetails = ({ animal, healthRecords = [], onAddHealthRecord }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddHealthRecord, setShowAddHealthRecord] = useState(false);

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
    const months = Math.floor(((new Date() - new Date(birthDate)) % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    return `${age} yrs ${months} mos`;
  };

  if (!animal) {
    return (
      <Card className="p-12 text-center">
        <p>{t('livestock.notFound') || 'Animal not found'}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/herd')}
            icon="arrow_back"
          >
            {t('common.back') || 'Back'}
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              {animal.name || animal.baitsTagNumber}
              <Badge variant={getStatusColor(animal.healthStatus)} size="md">
                {animal.healthStatus}
              </Badge>
            </h1>
            <p className="text-sage-500">BAITS: {animal.baitsTagNumber}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAddHealthRecord(true)}
            icon="add"
          >
            {t('livestock.addHealthRecord') || 'Add Health Record'}
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate(`/herd/${animal.id}/edit`)}
            icon="edit"
          >
            {t('common.edit') || 'Edit'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-sage-200 dark:border-sage-800">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('livestock.overview') || 'Overview'}
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'health'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('livestock.healthRecords') || 'Health Records'}
          </button>
          <button
            onClick={() => setActiveTab('pedigree')}
            className={`px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'pedigree'
                ? 'border-primary text-primary'
                : 'border-transparent text-sage-500 hover:text-sage-700'
            }`}
          >
            {t('livestock.pedigree') || 'Pedigree'}
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Basic Info Card */}
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4">{t('livestock.basicInfo') || 'Basic Information'}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.species') || 'Species'}</p>
                    <p className="font-medium capitalize">{animal.species}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.breed') || 'Breed'}</p>
                    <p className="font-medium">{animal.breed || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.age') || 'Age'}</p>
                    <p className="font-medium">{calculateAge(animal.birthDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.gender') || 'Gender'}</p>
                    <p className="font-medium capitalize">{animal.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.weight') || 'Weight'}</p>
                    <p className="font-medium">{animal.weight ? `${animal.weight} kg` : '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-sage-500 mb-1">{t('livestock.location') || 'Location'}</p>
                    <p className="font-medium">{animal.location || '—'}</p>
                  </div>
                </div>
              </Card>

              {/* Notes Card */}
              {animal.notes && (
                <Card className="p-6">
                  <h3 className="font-bold text-lg mb-4">{t('livestock.notes') || 'Notes'}</h3>
                  <p className="text-sage-700 dark:text-sage-300">{animal.notes}</p>
                </Card>
              )}
            </>
          )}

          {activeTab === 'health' && (
            <HealthRecordsList
              records={healthRecords}
              animalId={animal.id}
              onAddRecord={() => setShowAddHealthRecord(true)}
            />
          )}

          {activeTab === 'pedigree' && (
            <Card className="p-6">
              <h3 className="font-bold text-lg mb-4">{t('livestock.pedigree') || 'Pedigree Information'}</h3>
              <div className="space-y-4">
                <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                  <p className="text-sm text-sage-500 mb-1">{t('livestock.dam') || 'Dam (Mother)'}</p>
                  <p className="font-medium">{animal.damId || '—'}</p>
                </div>
                <div className="p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                  <p className="text-sm text-sage-500 mb-1">{t('livestock.sire') || 'Sire (Father)'}</p>
                  <p className="font-medium">{animal.sireId || '—'}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats Card */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">{t('livestock.quickStats') || 'Quick Stats'}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sage-500">{t('livestock.totalRecords') || 'Total Records'}</span>
                <span className="font-bold">{healthRecords.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sage-500">{t('livestock.lastCheck') || 'Last Check'}</span>
                <span className="font-bold">
                  {healthRecords[0]?.date || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sage-500">{t('livestock.vaccinations') || 'Vaccinations'}</span>
                <span className="font-bold">
                  {healthRecords.filter(r => r.type === 'vaccination').length}
                </span>
              </div>
            </div>
          </Card>

          {/* Quick Actions Card */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">{t('common.quickActions') || 'Quick Actions'}</h3>
            <div className="space-y-2">
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate(`/symptom-checker?animal=${animal.id}`)}
                icon="search"
              >
                {t('livestock.checkSymptoms') || 'Check Symptoms'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => navigate(`/telehealth?animal=${animal.id}`)}
                icon="videocam"
              >
                {t('livestock.consultVet') || 'Consult Vet'}
              </Button>
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {/* Handle export */}}
                icon="download"
              >
                {t('common.export') || 'Export Records'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Health Record Modal */}
      {showAddHealthRecord && (
        <AddHealthRecord
          animalId={animal.id}
          animalName={animal.name || animal.baitsTagNumber}
          onClose={() => setShowAddHealthRecord(false)}
          onSubmit={onAddHealthRecord}
        />
      )}
    </div>
  );
};

LivestockDetails.propTypes = {
  animal: PropTypes.object,
  healthRecords: PropTypes.array,
  onAddHealthRecord: PropTypes.func,
};

export default LivestockDetails;