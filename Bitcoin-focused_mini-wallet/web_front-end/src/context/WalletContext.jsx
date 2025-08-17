import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
  user: {
    isAuthenticated: false,
    address: '',
    publicKey: '',
    email: ''
  },
  wallet: {
    balance: 0,
    unconfirmedBalance: 0,
    transactions: [],
    addresses: [],
    loading: false,
    error: null
  },
  ui: {
    activeModal: null,
    notifications: [],
    theme: 'light'
  }
};

// Enhanced mock data
const mockTransactions = [
  {
    id: 'tx1',
    type: 'received',
    amount: 0.01234567,
    address: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    confirmations: 6,
    timestamp: Date.now() - 3600000,
    txHash: '1a2b3c4d5e6f7890abcdef1234567890abcdef12',
    status: 'confirmed',
    blockHeight: 2450123,
    fee: 0.00001234
  },
  {
    id: 'tx2',
    type: 'sent',
    amount: -0.00567890,
    address: 'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    confirmations: 2,
    timestamp: Date.now() - 1800000,
    txHash: '2b3c4d5e6f7a8901bcdef2345678901cdef23456',
    status: 'confirmed',
    blockHeight: 2450125,
    fee: 0.00000987
  },
  {
    id: 'tx3',
    type: 'received',
    amount: 0.00098765,
    address: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    confirmations: 0,
    timestamp: Date.now() - 300000,
    txHash: '3c4d5e6f7a8b9012cdef3456789012def3456789',
    status: 'pending',
    blockHeight: null,
    fee: 0.00000654
  }
];

const walletReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, wallet: { ...state.wallet, loading: action.payload } };

    case 'SET_BALANCE':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: action.payload.confirmed,
          unconfirmedBalance: action.payload.unconfirmed
        }
      };

    case 'SET_TRANSACTIONS':
      return {
        ...state,
        wallet: { ...state.wallet, transactions: action.payload }
      };

    case 'ADD_TRANSACTION':
      return {
        ...state,
        wallet: {
          ...state.wallet,
          transactions: [action.payload, ...state.wallet.transactions]
        }
      };

    case 'SET_USER':
      return { ...state, user: { ...state.user, ...action.payload } };

    case 'SET_MODAL':
      return { ...state, ui: { ...state.ui, activeModal: action.payload } };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [...state.ui.notifications, action.payload]
        }
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(n => n.id !== action.payload)
        }
      };

    case 'SET_ERROR':
      return { ...state, wallet: { ...state.wallet, error: action.payload } };

    default:
      return state;
  }
};

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [state, dispatch] = useReducer(walletReducer, initialState);

  // Mock API calls
  const mockApiDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const mockFetchBalance = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    await mockApiDelay(1000);
    dispatch({
      type: 'SET_BALANCE', payload: {
        confirmed: 0.02468135,
        unconfirmed: 0.00098765
      }
    });
    dispatch({ type: 'SET_LOADING', payload: false });
  };

  const mockFetchTransactions = async () => {
    await mockApiDelay(800);
    dispatch({ type: 'SET_TRANSACTIONS', payload: mockTransactions });
  };

  // Initialize mock data
  useEffect(() => {
    dispatch({
      type: 'SET_USER', payload: {
        isAuthenticated: true,
        address: 'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        email: 'demo@wallet.com'
      }
    });

    // Enhanced mock data
    const enhancedMockTransactions = generateMockTransactions(15);
    dispatch({ type: 'SET_TRANSACTIONS', payload: enhancedMockTransactions });

    mockFetchBalance();

    // Simulate periodic balance updates
    const balanceInterval = setInterval(() => {
      const randomChange = (Math.random() - 0.5) * 0.001; // Small random change
      dispatch({
        type: 'SET_BALANCE', payload: {
          confirmed: Math.max(0.001, 0.02468135 + randomChange),
          unconfirmed: Math.random() * 0.005
        }
      });
    }, 45000);

    return () => clearInterval(balanceInterval);
  }, []);

  const contextValue = {
    state,
    dispatch,
    // Helper functions
    addNotification: (message, type = 'info') => {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: Date.now(),
          message,
          type
        }
      });
    },
    openModal: (modalName) => {
      dispatch({ type: 'SET_MODAL', payload: modalName });
    },
    closeModal: () => {
      dispatch({ type: 'SET_MODAL', payload: null });
    }
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};