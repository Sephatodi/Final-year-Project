import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useOffline } from '../../hooks/useOffline';
import Spinner from '../common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isOffline } = useOffline();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // If offline and not authenticated, redirect to offline login
    if (isOffline) {
      return <Navigate to="/offline-login" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Check if user profile is complete (optional)
  const isProfileComplete = user?.fullName && (user?.role === 'farmer' ? user?.farmLocation : user?.specialization);

  if (!isProfileComplete && window.location.pathname !== '/settings') {
    return <Navigate to="/settings?tab=profile" replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;