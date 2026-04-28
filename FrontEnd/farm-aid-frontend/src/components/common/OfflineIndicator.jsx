// src/components/common/OfflineIndicator.jsx
import React from 'react';
import { useOffline } from '../../hooks/useOffline';

export const OfflineIndicator = () => {
  const { isOnline, pendingSyncCount } = useOffline();
  
  if (isOnline && pendingSyncCount === 0) return null;
  
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${!isOnline ? 'bg-yellow-500' : 'bg-blue-500'} text-white text-center py-1 text-sm`}>
      {!isOnline ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.212 0" />
          </svg>
          <span>You're offline - changes will sync when you're back online</span>
          {pendingSyncCount > 0 && (
            <span className="bg-white text-yellow-500 px-2 py-0.5 rounded-full text-xs">
              {pendingSyncCount} pending
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Syncing {pendingSyncCount} items...</span>
        </div>
      )}
    </div>
  );
};