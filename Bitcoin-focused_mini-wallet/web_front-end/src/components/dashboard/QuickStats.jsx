import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Activity, Clock, Users, Globe } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { formatBTC, formatUSD, formatTime } from '../../utils/formatters';
import { mockWalletStats, mockBitcoinStats } from '../../utils/mockData';
import Card from '../common/Card';

const QuickStats = () => {
  const { state } = useWallet();
  const { transactions } = state.wallet;

  const stats = [
    {
      icon: ArrowUpRight,
      label: 'Total Sent',
      value: formatBTC(mockWalletStats.totalSent),
      subValue: formatUSD(mockWalletStats.totalSent * 43250),
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      icon: ArrowDownLeft,
      label: 'Total Received',
      value: formatBTC(mockWalletStats.totalReceived),
      subValue: formatUSD(mockWalletStats.totalReceived * 43250),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Activity,
      label: 'Transactions',
      value: mockWalletStats.totalTransactions.toString(),
      subValue: `${transactions.filter(tx => tx.status === 'pending').length} pending`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      label: 'First Transaction',
      value: formatTime(mockWalletStats.firstTransactionDate, 'relative'),
      subValue: new Date(mockWalletStats.firstTransactionDate).toLocaleDateString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const networkStats = [
    {
      label: 'Block Height',
      value: mockBitcoinStats.blockHeight.toLocaleString(),
      icon: Globe
    },
    {
      label: 'Hash Rate',
      value: mockBitcoinStats.hashRate,
      icon: Activity
    },
    {
      label: 'Mempool',
      value: `${mockBitcoinStats.mempool} tx`,
      icon: Clock
    },
    {
      label: 'Market Cap',
      value: formatUSD(mockBitcoinStats.marketCap, true),
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Wallet Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900 truncate">{stat.value}</p>
                    <p className="text-xs text-gray-400 truncate">{stat.subValue}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Network Stats */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {networkStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <Icon className="h-6 w-6 text-bitcoin-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default QuickStats;