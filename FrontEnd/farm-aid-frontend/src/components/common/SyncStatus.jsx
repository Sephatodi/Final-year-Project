// src/components/common/SyncStatus.jsx
import React from 'react';
import { useSync } from '../../context/SyncContext';

export const SyncStatus = () => {
  const { isSyncing, pendingChanges } = useSync();

  if (!isSyncing && pendingChanges === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 border border-gray-200">
        {isSyncing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm text-gray-600">Syncing...</span>
          </>
        ) : pendingChanges > 0 && (
          <>
            <svg className="h-5 w-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-600">
              {pendingChanges} {pendingChanges === 1 ? 'change' : 'changes'} pending
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default SyncStatus;


