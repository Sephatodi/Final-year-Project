import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';

const ExpertInfo = ({ expert, consultation }) => {
  const { t } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);

  const mockExpert = {
    name: 'Dr. Kealeboga Molefe',
    title: 'Senior Veterinary Officer',
    specialization: 'Cattle & Small Ruminants',
    experience: '15 years',
    license: 'VET-2010-042',
    avatar: null,
    status: 'online',
    rating: 4.9,
    reviews: 128,
    languages: ['English', 'Setswana'],
    education: 'BVSc - University of Pretoria',
    availability: 'Available 24/7 for emergencies',
    ...expert
  };

  const expert_ = expert || mockExpert;

  const getStatusColor = (status) => {
    switch(status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        {expert_.avatar ? (
          <img
            src={expert_.avatar}
            alt={expert_.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="material-icons-outlined text-2xl text-primary">person</span>
          </div>
        )}
        {expert_.status && (
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-sage-900 ${
            expert_.status === 'online' ? 'bg-green-500' :
            expert_.status === 'away' ? 'bg-amber-500' :
            'bg-sage-400'
          }`} />
        )}
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold">{expert_.name}</h4>
          {expert_.status && (
            <Badge variant={getStatusColor(expert_.status)} size="sm">
              {expert_.status}
            </Badge>
          )}
        </div>
        
        <p className="text-sm text-sage-500">{expert_.title}</p>
        
        {/* Quick Stats */}
        <div className="flex items-center gap-4 mt-1 text-xs">
          {expert_.rating && (
            <div className="flex items-center gap-1">
              <span className="material-icons-outlined text-amber-500 text-xs">star</span>
              <span>{expert_.rating} ({expert_.reviews})</span>
            </div>
          )}
          {consultation?.priority === 'urgent' && (
            <Badge variant="critical" size="sm" icon="priority_high">
              {t('telehealth.urgent') || 'Urgent'}
            </Badge>
          )}
        </div>

        {/* Expandable Details */}
        {showDetails && (
          <div className="mt-4 p-4 bg-sage-50 dark:bg-sage-900/20 rounded-lg space-y-3">
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.specialization') || 'Specialization'}</p>
              <p className="text-sm font-medium">{expert_.specialization}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.experience') || 'Experience'}</p>
              <p className="text-sm font-medium">{expert_.experience}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.languages') || 'Languages'}</p>
              <p className="text-sm font-medium">{expert_.languages?.join(', ')}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.license') || 'License'}</p>
              <p className="text-sm font-medium">{expert_.license}</p>
            </div>
            <div>
              <p className="text-xs text-sage-500">{t('telehealth.education') || 'Education'}</p>
              <p className="text-sm font-medium">{expert_.education}</p>
            </div>
          </div>
        )}

        {/* Toggle Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-primary hover:underline mt-2 flex items-center gap-1"
        >
          {showDetails ? t('common.showLess') || 'Show less' : t('common.showMore') || 'Show more'}
          <span className="material-icons-outlined text-sm">
            {showDetails ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>
    </div>
  );
};

ExpertInfo.propTypes = {
  expert: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    specialization: PropTypes.string,
    experience: PropTypes.string,
    license: PropTypes.string,
    avatar: PropTypes.string,
    status: PropTypes.string,
    rating: PropTypes.number,
    reviews: PropTypes.number,
    languages: PropTypes.arrayOf(PropTypes.string),
    education: PropTypes.string,
  }),
  consultation: PropTypes.object,
};

export default ExpertInfo;