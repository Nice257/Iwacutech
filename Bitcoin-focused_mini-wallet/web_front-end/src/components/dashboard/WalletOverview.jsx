import React, { useState, useEffect } from 'react';
import { PieChart, BarChart3, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import { useBitcoinPrice } from '../../hooks/useBitcoinPrice';
import { formatBTC, formatUSD, animateValue } from '../../utils/formatters';
import Card from '../common/Card';

const WalletOverview = () => {
  const { state } = useWallet();
  const { current: btcPrice } = useBitcoinPrice();
  const { balance, unconfirmedBalance, transactions } = state.wallet;
  const [showBalance, setShowBalance] = useState(true);
  const [animatedBalance, setAnimatedBalance] = useState(0);

  const totalBalance = balance + unconfirmedBalance;
  const usdValue = totalBalance * btcPrice;

  // Animate balance changes
  useEffect(() => {
    animateValue(animatedBalance, totalBalance, 1000, setAnimatedBalance);
  }, [totalBalance]);

  // Portfolio breakdown
  const portfolioData = [
    {
      label: 'Available',
      value: balance,
      percentage: (balance / totalBalance) * 100,
      color: 'bg-green-500'
    },
    {
      label: 'Pending',
      value: unconfirmedBalance,
      percentage: (unconfirmedBalance / totalBalance) * 100,
      color: 'bg-yellow-500'
    }
  ];

  // Transaction summary
  const transactionSummary = {
    total: transactions.length,
    sent: transactions.filter(tx => tx.type === 'sent').length,
    received: transactions.filter(tx => tx.type === 'received').length,
    pending: transactions.filter(tx => tx.status === 'pending').length
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Balance Overview */}
      <Card className="bg-gradient-to-br from-bitcoin-500 to-bitcoin-600 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Portfolio Value</h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
          >
            {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-3xl font-bold">
              {showBalance ? formatUSD(animatedBalance * btcPrice) : '••••••••'}
            </p>
            <p className="text-bitcoin-100 text-lg">
              {showBalance ? `${formatBTC(animatedBalance)} BTC` : '••••••••'}
            </p>
          </div>

          {/* Portfolio Breakdown */}
          <div className="space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-bitcoin-100 text-sm">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">
                    {showBalance ? formatBTC(item.value) : '••••'}
                  </p>
                  <p className="text-bitcoin-200 text-xs">
                    {showBalance ? `${item.percentage.toFixed(1)}%` : '••••'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Transaction Overview */}
      <Card>
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="h-5 w-5 text-bitcoin-500" />
          <h3 className="text-lg font-semibold text-gray-900">Transaction Summary</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{transactionSummary.received}</div>
            <div className="text-sm text-green-700">Received</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{transactionSummary.sent}</div>
            <div className="text-sm text-red-700">Sent</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{transactionSummary.total}</div>
            <div className="text-sm text-blue-700">Total</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{transactionSummary.pending}</div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Portfolio Performance</span>
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+5.41%</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WalletOverview;