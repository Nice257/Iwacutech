import React from 'react';
import { Bitcoin } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-bitcoin-50 to-orange-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-bitcoin-500 rounded-xl shadow-lg">
              <Bitcoin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
          )}
        </div>

        {/* Content */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Secure Bitcoin Wallet • Testnet Environment</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;