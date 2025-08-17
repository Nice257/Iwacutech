import React, { useState } from 'react';
import { Bitcoin, Eye, EyeOff, TrendingUp, Copy, Check } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import Card from '../common/Card';

const BalanceCard = () => {
  const { state, addNotification } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  
  const { balance, unconfirmedBalance, loading } = state.wallet;
  const { address } = state.user;
  const totalBalance = balance + unconfirmedBalance;

  // Mock BTC price
  const btcPrice = 43250;

  const formatBTC = (amount) => {
    return showBalance ? `${amount.toFixed(8)} BTC` : '••••••••';
  };

  const formatUSD = (btcAmount) => {
    const usdValue = btcAmount * btcPrice;
    return showBalance ? `$${usdValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : '••••••••';
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      addNotification('Address copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      addNotification('Failed to copy address', 'error');
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  return (
    <Card className="bg-gradient-to-br from-bitcoin-500 to-bitcoin-600 text-white border-0 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4">
          <Bitcoin className="h-24 w-24" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Bitcoin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bitcoin Wallet</h2>
              <p className="text-bitcoin-100 text-sm">Testnet</p>
            </div>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
          >
            {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="space-y-4">
          {/* Main Balance */}
          <div>
            <p className="text-bitcoin-100 text-sm">Available Balance</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-3xl font-bold">
                {loading ? '••••••••' : formatBTC(balance)}
              </p>
            </div>
            <p className="text-bitcoin-100 text-lg">
              {loading ? '••••••••' : formatUSD(balance)}
            </p>
          </div>

          {/* Pending Balance */}
          {unconfirmedBalance > 0 && (
            <div className="border-t border-bitcoin-400 pt-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-bitcoin-200" />
                <div>
                  <p className="text-bitcoin-100 text-sm">Pending</p>
                  <p className="font-medium">{formatBTC(unconfirmedBalance)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Address */}
          <div className="border-t border-bitcoin-400 pt-3">
            <p className="text-bitcoin-100 text-sm mb-2">Your Address</p>
            <div className="flex items-center space-x-2">
              <code className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded">
                {formatAddress(address)}
              </code>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-200" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BalanceCard;