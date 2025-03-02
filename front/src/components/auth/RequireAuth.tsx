import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Permission } from '../../schemas/auth';
import { useAuth } from '../../contexts/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  permissions?: Permission[];
}

export function RequireAuth({ children, permissions = [] }: RequireAuthProps) {
  const { user, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permissions.length > 0 && !permissions.every(hasPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
