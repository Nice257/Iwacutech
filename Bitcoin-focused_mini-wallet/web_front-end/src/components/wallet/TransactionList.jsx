import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, ExternalLink, Filter } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import Card from '../common/Card';

const TransactionList = ({ onTransactionClick = null }) => {
  const { state } = useWallet();
  const { transactions, loading } = state.wallet;
  const [filter, setFilter] = useState('all'); // 'all', 'sent', 'received', 'pending'

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    if (filter === 'sent') return tx.type === 'sent';
    if (filter === 'received') return tx.type === 'received';
    if (filter === 'pending') return tx.status === 'pending';
    return true;
  });

  const getTransactionIcon = (type, status) => {
    const iconClass = "h-10 w-10 rounded-full flex items-center justify-center";
    
    if (status === 'pending') {
      return (
        <div className={`${iconClass} bg-yellow-100 animate-pulse`}>
          <Clock className="h-5 w-5 text-yellow-600" />
        </div>
      );
    }

    if (type === 'sent') {
      return (
        <div className={`${iconClass} bg-red-100`}>
          <ArrowUpRight className="h-5 w-5 text-red-600" />
        </div>
      );
    } else {
      return (
        <div className={`${iconClass} bg-green-100`}>
          <ArrowDownLeft className="h-5 w-5 text-green-600" />
        </div>
      );
    }
  };

  const getStatusBadge = (status, confirmations) => {
    if (status === 'confirmed') {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-xs">{confirmations}/6 confirmations</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span className="text-xs">Confirming...</span>
        </div>
      );
    }
  };

  const formatDate = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const openBlockExplorer = (txHash) => {
    // Testnet explorer
    window.open(`https://mempool.space/testnet/tx/${txHash}`, '_blank');
  };

  const FilterButton = ({ value, label, count }) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1 text-sm rounded-full transition-colors ${
        filter === value
          ? 'bg-bitcoin-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label} {count > 0 && <span className="ml-1">({count})</span>}
    </button>
  );

  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
        <div className="text-center py-12">
          <ArrowUpRight className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No transactions yet</p>
          <p className="text-gray-400 text-sm">Your transaction history will appear here</p>
        </div>
      </Card>
    );
  }

  const sentCount = transactions.filter(tx => tx.type === 'sent').length;
  const receivedCount = transactions.filter(tx => tx.type === 'received').length;
  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

  return (
    <Card>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">
          Transaction History ({filteredTransactions.length})
        </h3>
        
        {/* Filter buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <FilterButton value="all" label="All" count={transactions.length} />
          <FilterButton value="received" label="Received" count={receivedCount} />
          <FilterButton value="sent" label="Sent" count={sentCount} />
          <FilterButton value="pending" label="Pending" count={pendingCount} />
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {filteredTransactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center space-x-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onTransactionClick && onTransactionClick(tx)}
          >
            {getTransactionIcon(tx.type, tx.status)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {tx.type === 'sent' ? 'Sent Bitcoin' : 'Received Bitcoin'}
                  </p>
                  <button
                    onClick={() => openBlockExplorer(tx.txHash)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'sent' ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.type === 'sent' ? '-' : '+'}{Math.abs(tx.amount).toFixed(8)} BTC
                  </p>
                  <p className="text-xs text-gray-500">
                    Fee: {tx.fee?.toFixed(8)} BTC
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">
                  {tx.type === 'sent' ? 'To:' : 'From:'} {formatAddress(tx.address)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(tx.timestamp)}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                {getStatusBadge(tx.status, tx.confirmations)}
                {tx.blockHeight && (
                  <p className="text-xs text-gray-400">
                    Block: {tx.blockHeight.toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredTransactions.length > 0 && (
        <div className="mt-4 text-center">
          <button className="text-bitcoin-500 hover:text-bitcoin-600 text-sm font-medium">
            View All Transactions
          </button>
        </div>
      )}
    </Card>
  );
};

export default TransactionList;