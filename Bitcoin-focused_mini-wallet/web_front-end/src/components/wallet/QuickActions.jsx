import React from 'react';
import { Send, Download, QrCode, ArrowUpDown } from 'lucide-react';
import { useWallet } from '../../context/WalletContext';
import Card from '../common/Card';
import Button from '../common/Button';

const QuickActions = () => {
  const { dispatch } = useWallet();

  const handleSend = () => {
    dispatch({ type: 'SET_MODAL', payload: 'send' });
  };

  const handleReceive = () => {
    dispatch({ type: 'SET_MODAL', payload: 'receive' });
  };

  const handleScan = () => {
    // Future: QR code scanning
    dispatch({ type: 'ADD_NOTIFICATION', payload: {
      id: Date.now(),
      type: 'info',
      message: 'QR Scanner coming soon!'
    }});
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSend}
          className="flex-col h-20 space-y-1"
        >
          <Send className="h-6 w-6" />
          <span>Send</span>
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleReceive}
          className="flex-col h-20 space-y-1"
        >
          <Download className="h-6 w-6" />
          <span>Receive</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleScan}
          className="flex-col h-20 space-y-1"
        >
          <QrCode className="h-6 w-6" />
          <span>Scan QR</span>
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex-col h-20 space-y-1"
        >
          <ArrowUpDown className="h-6 w-6" />
          <span>History</span>
        </Button>
      </div>
    </Card>
  );
};

export default QuickActions;