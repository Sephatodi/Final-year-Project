import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

const MovementRestrictions = ({ restrictions = [], userLocation }) => {
  const { t } = useTranslation();
  const [selectedRestriction, setSelectedRestriction] = useState(null);

  const mockRestrictions = restrictions.length ? restrictions : [
    {
      id: 1,
      zone: 'Zone 6B',
      disease: 'Foot and Mouth Disease',
      restriction: 'Complete movement ban on all cloven-hoofed animals',
      effectiveFrom: '2024-03-01',
      effectiveUntil: '2024-04-15',
      permits: 'No permits issued',
      affectedSpecies: ['cattle', 'goats', 'sheep'],
      checkpoints: ['Francistown North', 'Tati Siding'],
      penalties: 'P5000 fine or imprisonment',
      severity: 'critical'
    },
    {
      id: 2,
      zone: 'Zone 4A',
      disease: 'Heartwater',
      restriction: 'Movement requires veterinary inspection and permit',
      effectiveFrom: '2024-03-05',
      effectiveUntil: '2024-05-01',
      permits: 'Available at district offices',
      affectedSpecies: ['cattle', 'goats'],
      checkpoints: ['Gaborone West', 'Molepolole'],
      penalties: 'P2000 fine',
      severity: 'warning'
    },
    {
      id: 3,
      zone: 'Zone 2C',
      disease: 'Anthrax',
      restriction: 'Vaccination required 14 days before movement',
      effectiveFrom: '2024-02-15',
      effectiveUntil: '2024-06-30',
      permits: 'Online application available',
      affectedSpecies: ['cattle', 'sheep'],
      checkpoints: ['Maun', 'Shakawe'],
      penalties: 'Animals will be quarantined',
      severity: 'info'
    }
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'critical': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-amber-500 bg-amber-50 dark:bg-amber-900/20';
      case 'info': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-sage-500 bg-sage-50 dark:bg-sage-900/20';
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical': return 'critical';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const checkIfUserInZone = (zone) => {
    // In production, this would check actual coordinates
    return zone.id === 1; // Mock: user is in Zone 6B
  };

  const userInRestrictedZone = mockRestrictions.some(r => checkIfUserInZone(r));

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg">
              {t('alerts.movementRestrictions') || 'Movement Restrictions'}
            </h3>
            <p className="text-sm text-sage-500">
              {t('alerts.restrictionsSubtitle') || 'Current livestock movement controls'}
            </p>
          </div>
          
          {userInRestrictedZone && (
            <Badge variant="critical" size="lg" icon="warning">
              {t('alerts.youAreInRestrictedZone') || 'YOU ARE IN A RESTRICTED ZONE'}
            </Badge>
          )}
        </div>
      </div>

      {/* Active Restrictions List */}
      <div className="divide-y divide-sage-200 dark:divide-sage-800">
        {mockRestrictions.map(restriction => {
          const userInZone = checkIfUserInZone(restriction);
          
          return (
            <div
              key={restriction.id}
              className={`p-6 ${userInZone ? getSeverityColor(restriction.severity) : ''}`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-lg">{restriction.zone}</h4>
                    <Badge variant={getSeverityBadge(restriction.severity)} size="sm">
                      {restriction.severity}
                    </Badge>
                    {userInZone && (
                      <Badge variant="critical" size="sm" icon="location_on">
                        {t('alerts.yourZone') || 'Your Zone'}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="font-medium text-sage-700 dark:text-sage-300">
                    {restriction.disease}
                  </p>
                  
                  <p className="text-sm text-sage-600 dark:text-sage-400 mt-2">
                    {restriction.restriction}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRestriction(
                    selectedRestriction === restriction.id ? null : restriction.id
                  )}
                  icon={selectedRestriction === restriction.id ? 'expand_less' : 'expand_more'}
                />
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-sage-500">{t('alerts.effectiveFrom') || 'From'}</p>
                  <p className="font-medium">{new Date(restriction.effectiveFrom).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-500">{t('alerts.effectiveUntil') || 'Until'}</p>
                  <p className="font-medium">{new Date(restriction.effectiveUntil).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-500">{t('alerts.permits') || 'Permits'}</p>
                  <p className="font-medium">{restriction.permits}</p>
                </div>
                <div>
                  <p className="text-xs text-sage-500">{t('alerts.affectedSpecies') || 'Species'}</p>
                  <p className="font-medium capitalize">{restriction.affectedSpecies.join(', ')}</p>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedRestriction === restriction.id && (
                <div className="mt-6 pt-6 border-t border-sage-200 dark:border-sage-800">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Checkpoints */}
                    <div>
                      <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">location_on</span>
                        {t('alerts.checkpoints') || 'Checkpoints'}
                      </h5>
                      <ul className="space-y-2">
                        {restriction.checkpoints.map((cp, index) => (
                          <li key={index} className="text-sm flex items-center gap-2">
                            <span className="material-icons-outlined text-sage-400 text-sm">flag</span>
                            {cp}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Penalties */}
                    <div>
                      <h5 className="font-bold text-sm mb-3 flex items-center gap-2">
                        <span className="material-icons-outlined text-primary">gavel</span>
                        {t('alerts.penalties') || 'Penalties'}
                      </h5>
                      <p className="text-sm p-3 bg-sage-50 dark:bg-sage-900/20 rounded-lg">
                        {restriction.penalties}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="md:col-span-2 flex gap-3 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        icon="description"
                      >
                        {t('alerts.applyPermit') || 'Apply for Permit'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon="help"
                      >
                        {t('alerts.contactOfficer') || 'Contact Officer'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer with Emergency Contact */}
      <div className="px-6 py-4 bg-sage-50 dark:bg-sage-900/20 border-t border-sage-200 dark:border-sage-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-icons-outlined text-primary">phone</span>
            <span className="text-sm font-medium">
              {t('alerts.reportViolations') || 'Report violations:'}
            </span>
          </div>
          <a href="tel:0800600777" className="text-primary font-bold hover:underline">
            0800 600 777
          </a>
        </div>
      </div>
    </Card>
  );
};

MovementRestrictions.propTypes = {
  restrictions: PropTypes.array,
  userLocation: PropTypes.object,
};

export default MovementRestrictions;