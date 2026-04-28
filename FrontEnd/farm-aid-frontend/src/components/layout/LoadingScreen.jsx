import React from 'react';
import Spinner from '../common/Spinner';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-background-dark flex flex-col items-center justify-center z-50">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
        <span className="material-icons-outlined text-5xl text-primary">agriculture</span>
      </div>
      <h1 className="text-2xl font-bold text-primary mb-2">Farm-Aid</h1>
      <p className="text-sage-500 mb-8">Botswana Livestock Management</p>
      <Spinner size="lg" />
      <p className="text-sm text-sage-400 mt-4">Loading your farm data...</p>
    </div>
  );
};

export default LoadingScreen;