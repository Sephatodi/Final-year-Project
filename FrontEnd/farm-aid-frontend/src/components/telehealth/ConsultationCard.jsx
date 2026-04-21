import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Card from '../common/Card';
import Badge from '../common/Badge';

const ConsultationCard = ({ consultation, onClick }) => {
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'resolved': return 'info';
      case 'urgent': return 'critical';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'urgent': return 'priority_high';
      case 'high': return 'arrow_upward';
      case 'normal': return 'remove';
      case 'low': return 'arrow_downward';
      default: return 'info';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.justNow') || 'Just now';
    if (diffMins < 60) return `${diffMins}m ${t('time.ago') || 'ago'}`;
    if (diffHours < 24) return `${diffHours}h ${t('time.ago') || 'ago'}`;
    if (diffDays < 7) return `${diffDays}d ${t('time.ago') || 'ago'}`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="p-6 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Expert Avatar/Icon */}
        <div className="flex-shrink-0">
          {consultation.expertAvatar ? (
            <img
              src={consultation.expertAvatar}
              alt={consultation.expertName}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-icons-outlined text-3xl text-primary">person</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                {consultation.title}
              </h3>
              <p className="text-sm text-sage-500">
                {t('telehealth.with') || 'with'} {consultation.expertName || 'Waiting for expert'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {consultation.priority && consultation.priority !== 'normal' && (
                <Badge
                  variant={consultation.priority === 'urgent' ? 'critical' : 'warning'}
                  size="sm"
                  icon={getPriorityIcon(consultation.priority)}
                >
                  {consultation.priority}
                </Badge>
              )}
              <Badge variant={getStatusColor(consultation.status)} size="sm">
                {consultation.status}
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.animal') || 'Animal'}</p>
              <p className="text-sm font-medium">{consultation.animalName || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.lastMessage') || 'Last Message'}</p>
              <p className="text-sm font-medium truncate">
                {consultation.lastMessage || t('telehealth.noMessages') || 'No messages'}
              </p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.time') || 'Time'}</p>
              <p className="text-sm font-medium">{formatTime(consultation.updatedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.messages') || 'Messages'}</p>
              <p className="text-sm font-medium">{consultation.messageCount || 0}</p>
            </div>
          </div>

          {/* Unread Badge */}
          {consultation.unreadCount > 0 && (
            <div className="mt-4 flex justify-end">
              <Badge variant="primary" size="sm">
                {consultation.unreadCount} {t('telehealth.unread') || 'unread'}
              </Badge>
            </div>
          )}
        </div>

        {/* Chevron Icon */}
        <div className="flex-shrink-0 self-center">
          <span className="material-icons-outlined text-sage-400 group-hover:text-primary transition-colors">
            chevron_right
          </span>
        </div>
      </div>

      {/* AI Suggestion Preview */}
      {consultation.aiSuggestion && (
        <div className="mt-4 pt-4 border-t border-sage-200 dark:border-sage-800">
          <div className="flex items-start gap-2 text-sm">
            <span className="material-icons-outlined text-primary text-sm">bolt</span>
            <span className="text-sage-600 dark:text-sage-400">
              <span className="font-medium">AI Suggestion:</span> {consultation.aiSuggestion}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};

ConsultationCard.propTypes = {
  consultation: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    expertName: PropTypes.string,
    expertAvatar: PropTypes.string,
    status: PropTypes.string,
    priority: PropTypes.string,
    animalName: PropTypes.string,
    lastMessage: PropTypes.string,
    messageCount: PropTypes.number,
    unreadCount: PropTypes.number,
    updatedAt: PropTypes.string,
    aiSuggestion: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func,
};

export default ConsultationCard;