import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  restricted?: boolean; // If true, authenticated users can't access this route
}

export function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If this is a restricted route (like login/signup) and user is authenticated, redirect to dashboard
  if (restricted && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
