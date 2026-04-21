import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ReportStatus from './ReportStatus';

const ReportHistory = ({ reports = [], loading = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  const getStatusIcon = (status) => {
    switch(status) {
      case 'submitted': return 'send';
      case 'acknowledged': return 'visibility';
      case 'investigating': return 'search';
      case 'confirmed': return 'warning';
      case 'resolved': return 'check_circle';
      case 'pending': return 'schedule';
      default: return 'article';
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.status === filter);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending' || r.status === 'submitted').length,
    investigating: reports.filter(r => r.status === 'investigating').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  };

  if (loading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-sage-200 dark:bg-sage-800 rounded"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="p-12 text-center">
        <span className="material-icons-outlined text-5xl text-sage-300 mb-4">assignment</span>
        <h3 className="text-lg font-bold mb-2">{t('report.noReports') || 'No Reports Yet'}</h3>
        <p className="text-sage-500 mb-6">
          {t('report.noReportsMessage') || 'You haven\'t submitted any disease reports yet.'}
        </p>
        <Button onClick={() => navigate('/report-disease')} icon="add">
          {t('report.newReport') || 'Submit a Report'}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{t('report.history') || 'Report History'}</h2>
          <p className="text-sage-500">{t('report.totalReports') || 'Total reports'}: {stats.total}</p>
        </div>

        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-sage-200 dark:border-sage-800 bg-white dark:bg-sage-900"
          >
            <option value="all">{t('report.allReports') || 'All Reports'}</option>
            <option value="pending">{t('report.pending') || 'Pending'}</option>
            <option value="investigating">{t('report.investigating') || 'Investigating'}</option>
            <option value="resolved">{t('report.resolved') || 'Resolved'}</option>
          </select>

          <Button variant="primary" size="sm" onClick={() => navigate('/report-disease')} icon="add">
            {t('report.new') || 'New'}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
          <div className="text-xs text-sage-500">{t('report.pending') || 'Pending'}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.investigating}</div>
          <div className="text-xs text-sage-500">{t('report.investigating') || 'Investigating'}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-xs text-sage-500">{t('report.resolved') || 'Resolved'}</div>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.map((report) => (
          <Card
            key={report.id}
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/reports/${report.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              {/* Left Side - Main Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`p-2 rounded-lg ${
                    report.status === 'resolved' ? 'bg-green-100' :
                    report.status === 'investigating' ? 'bg-blue-100' :
                    'bg-amber-100'
                  }`}>
                    <span className={`material-icons-outlined ${
                      report.status === 'resolved' ? 'text-green-600' :
                      report.status === 'investigating' ? 'text-blue-600' :
                      'text-amber-600'
                    }`}>
                      {getStatusIcon(report.status)}
                    </span>
                  </span>
                  
                  <div>
                    <h3 className="font-bold">{report.reportId}</h3>
                    <p className="text-sm text-sage-500">
                      {new Date(report.submittedAt).toLocaleDateString()} at{' '}
                      {new Date(report.submittedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <p className="text-xs text-sage-500">{t('report.species') || 'Species'}</p>
                    <p className="text-sm font-medium capitalize">{report.species}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">{t('report.animals') || 'Animals'}</p>
                    <p className="text-sm font-medium">{report.animalCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">{t('report.location') || 'Location'}</p>
                    <p className="text-sm font-medium truncate">{report.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage-500">{t('report.disease') || 'Disease'}</p>
                    <p className="text-sm font-medium">{report.suspectedDisease || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Status */}
              <div className="flex flex-col items-end gap-2">
                <ReportStatus status={report.status} size="lg" />
                
                {report.urgent && (
                  <Badge variant="critical" size="sm" icon="warning">
                    URGENT
                  </Badge>
                )}

                {report.response && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <span className="material-icons-outlined text-sm">forum</span>
                    Response received
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar for Active Reports */}
            {report.status === 'investigating' && (
              <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-sage-500">{t('report.investigationProgress') || 'Investigation progress'}</span>
                  <span className="font-medium">60%</span>
                </div>
                <div className="w-full h-1.5 bg-sage-200 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-8 text-center text-sage-500">
          <p>{t('report.noFilteredReports') || 'No reports match the selected filter'}</p>
        </Card>
      )}
    </div>
  );
};

ReportHistory.propTypes = {
  reports: PropTypes.array,
  loading: PropTypes.bool,
};

export default ReportHistory;