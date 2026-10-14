import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

import { GearLoader } from '../common/GearLoader';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <GearLoader
        fullScreen
        theme="dark"
        color="text-emerald-500"
        text="Verifying session..."
      />
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to the role's native page
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'fleet_manager') return <Navigate to="/manager/dashboard" replace />;
    if (user.role === 'driver') return <Navigate to="/driver/home" replace />;
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
