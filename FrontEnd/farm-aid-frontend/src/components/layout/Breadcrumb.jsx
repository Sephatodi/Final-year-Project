import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Breadcrumb = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const routeNames = {
    dashboard: t('nav.dashboard') || 'Dashboard',
    herd: t('nav.herd') || 'My Herd',
    'symptom-checker': t('nav.symptoms') || 'Symptom Checker',
    'report-disease': t('nav.report_disease') || 'Report Disease',
    telehealth: t('nav.telehealth') || 'Telehealth',
    'knowledge-base': t('nav.knowledge') || 'Knowledge Base',
    alerts: t('nav.alerts') || 'Alerts',
    settings: t('nav.settings') || 'Settings',
    reports: t('nav.reports') || 'Reports',
    market: t('nav.market') || 'Market Prices',
    analytics: t('nav.analytics') || 'Analytics',
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-sage-500 mb-4">
      <Link to="/dashboard" className="hover:text-primary transition-colors">
        <span className="material-icons-outlined text-base">home</span>
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <span className="material-icons-outlined text-sm">chevron_right</span>
            {isLast ? (
              <span className="text-sage-900 dark:text-white font-medium">
                {routeNames[name] || name}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-primary transition-colors"
              >
                {routeNames[name] || name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;