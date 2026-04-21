import React from 'react';
import { NavLink } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import { useTranslation } from 'react-i18next';

const MobileNav = () => {
  const { isOffline } = useOffline();
  const { t } = useTranslation();

  const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: t('nav.dashboard') || 'Home' },
    { path: '/herd', icon: 'pets', label: t('nav.herd') || 'Herd' },
    { path: '/symptom-checker', icon: 'search', label: t('nav.symptoms') || 'Check' },
    { path: '/telehealth', icon: 'videocam', label: t('nav.telehealth') || 'Vet' },
    { path: '/alerts', icon: 'notifications', label: t('nav.alerts') || 'Alerts' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-2 py-1 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 lg:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center rounded-lg px-3 py-2 ${
                  isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                }`
              }
            >
              <span className="material-icons-outlined text-2xl">{item.icon}</span>
              <span className="mt-1 text-[11px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {isOffline && (
        <div className="fixed bottom-20 left-4 z-50 lg:hidden">
          <div className="flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
            <span className="material-icons-outlined text-sm">cloud_off</span>
            Offline
          </div>
        </div>
      )}

      <div className="h-20 lg:hidden" />
    </>
  );
};

export default MobileNav;
