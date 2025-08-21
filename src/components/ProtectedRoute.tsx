import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWallet } from '../contexts/WalletContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireWallet?: boolean;
}

export default function ProtectedRoute({ children, requireWallet = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { wallets } = useWallet();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireWallet && wallets.length === 0) {
    return <Navigate to="/connect" replace />;
  }

  return <>{children}</>;
}