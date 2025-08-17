import React from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Hash,
  Building,
  Activity
} from 'lucide-react';
import { formatBTC, formatUSD, formatTime, formatTxHash } from '../../utils/formatters';
import Modal from '../common/Modal';
import Button from '../common/Button';

const TransactionModal = ({ transaction, isOpen, onClose, btcPrice = 43250 }) => {
  const [copied, setCopied] = React.useState('');

  if (!transaction) return null;

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openBlockExplorer = () => {
    const baseUrl = 'https://mempool.space/testnet/tx/';
    window.open(`${baseUrl}${transaction.txHash}`, '_blank');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'sent' ? (
      <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
        <ArrowUpRight className="h-6 w-6 text-red-600" />
      </div>
    ) : (
      <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
        <ArrowDownLeft className="h-6 w-6 text-green-600" />
      </div>
    );
  };

  const InfoRow = ({ icon: Icon, label, value, copyable = false, copyType = '' }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-400" />
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-900 font-mono">{value}</span>
        {copyable && (
          <button
            onClick={() => copyToClipboard(value, copyType)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {copied === copyType ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4 text-gray-400" />
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Transaction Details">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          {getTypeIcon(transaction.type)}
          <h3 className="mt-4 text-xl font-bold text-gray-900 capitalize">
            Bitcoin {transaction.type}
          </h3>
          <div className="mt-2">
            <span className={`text-2xl font-bold ${
              transaction.type === 'sent' ? 'text-red-600' : 'text-green-600'
            }`}>
              {transaction.type === 'sent' ? '-' : '+'}{formatBTC(Math.abs(transaction.amount))} BTC
            </span>
            <p className="text-gray-500 mt-1">
              ≈ {formatUSD(Math.abs(transaction.amount) * btcPrice)}
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="mt-3 inline-flex items-center space-x-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
              {transaction.status === 'confirmed' ? (
                <CheckCircle className="h-4 w-4 mr-1" />
              ) : (
                <Clock className="h-4 w-4 mr-1" />
              )}
              {transaction.status === 'confirmed' ? 'Confirmed' : 'Pending'}
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Transaction Information</h4>
          <div className="space-y-1">
            <InfoRow
              icon={Hash}
              label="Transaction ID"
              value={formatTxHash(transaction.txHash, 12)}
              copyable={true}
              copyType="txHash"
            />
            <InfoRow
              icon={Calendar}
              label="Date & Time"
              value={formatTime(transaction.timestamp, 'full')}
            />
            <InfoRow
              icon={Activity}
              label="Confirmations"
              value={`${transaction.confirmations}/6`}
            />
            {transaction.blockHeight && (
              <InfoRow
                icon={Building}
                label="Block Height"
                value={transaction.blockHeight.toLocaleString()}
              />
            )}
            <InfoRow
              icon={ArrowUpRight}
              label="Network Fee"
              value={`${formatBTC(transaction.fee)} BTC`}
            />
            {transaction.size && (
              <InfoRow
                icon={Activity}
                label="Transaction Size"
                value={`${transaction.size} bytes`}
              />
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Address Information</h4>
          <div className="space-y-1">
            <InfoRow
              icon={ArrowUpRight}
              label={transaction.type === 'sent' ? 'To Address' : 'From Address'}
              value={transaction.address}
              copyable={true}
              copyType="address"
            />
          </div>
        </div>

        {/* Additional Info for Confirmed Transactions */}
        {transaction.status === 'confirmed' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Transaction Confirmed</h4>
                <p className="text-sm text-green-700">
                  This transaction has been confirmed {transaction.confirmations} times and is secure.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Transaction Info */}
        {transaction.status === 'pending' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Transaction Pending</h4>
                <p className="text-sm text-yellow-700">
                  This transaction is waiting for network confirmation. It typically takes 10-60 minutes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="primary"
            onClick={openBlockExplorer}
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Block Explorer
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;