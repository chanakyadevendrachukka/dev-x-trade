import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <PageLayout title="Loading...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </PageLayout>
    );
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
}
