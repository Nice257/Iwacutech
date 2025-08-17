import React from 'react';
import { Bitcoin, Settings, LogOut, User } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';

const Header = () => {
  const { state, dispatch } = useWallet();
  const { user } = state;

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: { isAuthenticated: false } });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500 rounded-lg">
            <Bitcoin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bitcoin Wallet</h1>
            <p className="text-sm text-gray-500">Secure & Simple</p>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">{user.email}</p>
            <p className="text-xs text-gray-500">
              {user.address ? `${user.address.slice(0, 8)}...${user.address.slice(-8)}` : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;