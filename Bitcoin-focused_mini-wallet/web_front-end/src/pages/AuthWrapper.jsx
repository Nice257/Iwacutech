import React from 'react';
import { useAuth } from '../context/AuthContext';
import Dashboard from './Dashboard';
import Login from './Login';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AuthWrapper = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-500">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Dashboard /> : <Login />;
};

export default AuthWrapper;