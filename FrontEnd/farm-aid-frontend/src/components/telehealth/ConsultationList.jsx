import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import ConsultationCard from './ConsultationCard';

const ConsultationList = ({ consultations = [], loading = false, onNewConsultation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsultations = consultations.filter(consultation => {
    // Apply status filter
    if (filter !== 'all' && consultation.status !== filter) return false;
    
    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        consultation.title?.toLowerCase().includes(searchLower) ||
        consultation.expertName?.toLowerCase().includes(searchLower) ||
        consultation.animalName?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const stats = {
    total: consultations.length,
    active: consultations.filter(c => c.status === 'active').length,
    pending: consultations.filter(c => c.status === 'pending').length,
    resolved: consultations.filter(c => c.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-20 bg-sage-200 dark:bg-sage-800 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('telehealth.title') || 'Telehealth Consultations'}</h2>
          <p className="text-sage-500">{t('telehealth.subtitle') || 'Connect with veterinary experts'}</p>
        </div>

        <Button
          variant="primary"
          onClick={onNewConsultation}
          icon="add"
        >
          {t('telehealth.newConsultation') || 'New Consultation'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-primary">{stats.total}</div>
          <div className="text-xs text-sage-500">{t('telehealth.total') || 'Total'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          <div className="text-xs text-sage-500">{t('telehealth.active') || 'Active'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-xs text-sage-500">{t('telehealth.pending') || 'Pending'}</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{stats.resolved}</div>
          <div className="text-xs text-sage-500">{t('telehealth.resolved') || 'Resolved'}</div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('telehealth.search') || 'Search consultations...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon="search"
            fullWidth
          />
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
        >
          <option value="all">{t('telehealth.allStatus') || 'All Status'}</option>
          <option value="pending">{t('telehealth.pending') || 'Pending'}</option>
          <option value="active">{t('telehealth.active') || 'Active'}</option>
          <option value="resolved">{t('telehealth.resolved') || 'Resolved'}</option>
        </select>
      </div>

      {/* Consultations List */}
      {filteredConsultations.length > 0 ? (
        <div className="space-y-4">
          {filteredConsultations.map(consultation => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
              onClick={() => navigate(`/telehealth/${consultation.id}`)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <span className="material-icons-outlined text-5xl text-sage-300 mb-4">videocam_off</span>
          <h3 className="text-lg font-bold mb-2">
            {t('telehealth.noConsultations') || 'No Consultations Found'}
          </h3>
          <p className="text-sage-500 mb-6">
            {searchTerm 
              ? t('telehealth.noSearchResults') || 'No consultations match your search'
              : t('telehealth.startFirst') || 'Start your first consultation with a veterinarian'}
          </p>
          <Button onClick={onNewConsultation} icon="add">
            {t('telehealth.newConsultation') || 'New Consultation'}
          </Button>
        </Card>
      )}
    </div>
  );
};

ConsultationList.propTypes = {
  consultations: PropTypes.array,
  loading: PropTypes.bool,
  onNewConsultation: PropTypes.func.isRequired,
};

export default ConsultationList;