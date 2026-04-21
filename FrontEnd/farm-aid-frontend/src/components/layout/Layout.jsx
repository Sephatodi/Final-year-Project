import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useOffline } from '../../context/OfflineContext';
import { useSync } from '../../context/SyncContext';

const Layout = () => {
  const { isOffline } = useOffline();
  const { pendingChanges } = useSync();

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background-light text-slate-800 dark:bg-background-dark dark:text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.12),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(212,163,115,0.1),transparent_38%)]" />

      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        <Header />

        {(isOffline || pendingChanges > 0) && (
          <div className="border-b border-slate-200/70 bg-white/80 px-4 py-2 text-xs font-medium text-slate-600 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 md:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-end gap-4">
              {isOffline && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                  <span className="material-icons-outlined text-sm">cloud_off</span>
                  Offline mode
                </span>
              )}
              {pendingChanges > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                  <span className="material-icons-outlined text-sm">sync</span>
                  {pendingChanges} pending sync
                </span>
              )}
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto px-4 pb-28 pt-4 md:px-6 md:pb-8 lg:px-8 lg:pt-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>

        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;
