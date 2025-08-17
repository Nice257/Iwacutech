import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  setAuthTokens, 
  getAuthToken, 
  removeAuthTokens, 
  isTokenExpired,
  getTokenPayload,
  makeAuthenticatedRequest 
} from '../utils/auth';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload,
        error: null 
      };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, error: null };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock API functions (replace with real API calls later)
  const mockLogin = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (email === 'demo@wallet.com' && password === 'Password123!') {
      const mockToken = 'mock.jwt.token.here';
      const mockUser = {
        id: '1',
        email: email,
        address: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        createdAt: new Date().toISOString(),
        twoFactorEnabled: false
      };
      
      setAuthTokens(mockToken);
      return { user: mockUser, token: mockToken };
    }
    
    throw new Error('Invalid email or password');
  };

  const mockRegister = async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock registration
    if (email && password) {
      const mockToken = 'mock.jwt.token.here';
      const mockUser = {
        id: Date.now().toString(),
        email: email,
        address: 'tb1q' + Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        twoFactorEnabled: false
      };
      
      setAuthTokens(mockToken);
      return { user: mockUser, token: mockToken };
    }
    
    throw new Error('Registration failed');
  };

  // Auth actions
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, token } = await mockLogin(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      
      const { user, token } = await mockRegister(email, password);
      dispatch({ type: 'SET_USER', payload: user });
      
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      return { success: false, error: error.message };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = () => {
    removeAuthTokens();
    dispatch({ type: 'LOGOUT' });
  };

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      
      if (!token || isTokenExpired(token)) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // In real app, validate token with backend
      // For now, use mock user
      const mockUser = {
        id: '1',
        email: 'demo@wallet.com',
        address: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        createdAt: new Date().toISOString(),
        twoFactorEnabled: false
      };
      
      dispatch({ type: 'SET_USER', payload: mockUser });
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAuthTokens();
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' })
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};