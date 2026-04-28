import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Badge from '../common/Badge';

const ReportStatus = ({ status, size = 'md', showIcon = true }) => {
  const { t } = useTranslation();

  const statusConfig = {
    pending: {
      variant: 'warning',
      icon: 'schedule',
      label: t('report.status.pending') || 'Pending',
      description: t('report.status.pendingDesc') || 'Waiting to be submitted'
    },
    submitted: {
      variant: 'info',
      icon: 'send',
      label: t('report.status.submitted') || 'Submitted',
      description: t('report.status.submittedDesc') || 'Report received by DVS'
    },
    acknowledged: {
      variant: 'info',
      icon: 'visibility',
      label: t('report.status.acknowledged') || 'Acknowledged',
      description: t('report.status.acknowledgedDesc') || 'DVS has seen your report'
    },
    investigating: {
      variant: 'warning',
      icon: 'search',
      label: t('report.status.investigating') || 'Investigating',
      description: t('report.status.investigatingDesc') || 'Officer assigned to your case'
    },
    confirmed: {
      variant: 'critical',
      icon: 'warning',
      label: t('report.status.confirmed') || 'Confirmed',
      description: t('report.status.confirmedDesc') || 'Disease confirmed by testing'
    },
    false_alarm: {
      variant: 'success',
      icon: 'check_circle',
      label: t('report.status.falseAlarm') || 'False Alarm',
      description: t('report.status.falseAlarmDesc') || 'No disease detected'
    },
    resolved: {
      variant: 'success',
      icon: 'check_circle',
      label: t('report.status.resolved') || 'Resolved',
      description: t('report.status.resolvedDesc') || 'Case closed'
    },
    rejected: {
      variant: 'error',
      icon: 'cancel',
      label: t('report.status.rejected') || 'Rejected',
      description: t('report.status.rejectedDesc') || 'Report was not valid'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className="inline-flex flex-col items-end">
      <Badge
        variant={config.variant}
        size={size}
        icon={showIcon ? config.icon : null}
      >
        {config.label}
      </Badge>
      {size === 'lg' && (
        <span className="text-xs text-sage-500 mt-1">{config.description}</span>
      )}
    </div>
  );
};

ReportStatus.propTypes = {
  status: PropTypes.oneOf([
    'pending', 'submitted', 'acknowledged', 'investigating',
    'confirmed', 'false_alarm', 'resolved', 'rejected'
  ]).isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  showIcon: PropTypes.bool,
};

export default ReportStatus;