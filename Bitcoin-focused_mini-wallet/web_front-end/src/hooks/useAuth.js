import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Custom hook for easier auth access
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook for protected components
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (!isLoading && !isAuthenticated) {
    throw new Error('This component requires authentication');
  }
  
  return { isAuthenticated, isLoading };
};

export default useAuth;