import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useBitcoinPrice } from '../hooks/useBitcoinPrice';
import Layout from '../components/layout/Layout';
import WalletOverview from '../components/dashboard/WalletOverview';
import PriceChart from '../components/dashboard/PriceChart';
import QuickStats from '../components/dashboard/QuickStats';
import RecentActivity from '../components/dashboard/RecentActivity';
import BalanceCard from '../components/wallet/BalanceCard';
import QuickActions from '../components/wallet/QuickActions';
import TransactionList from '../components/wallet/TransactionList';
import TransactionModal from '../components/wallet/TransactionModal';
import Modal from '../components/common/Modal';

const Dashboard = () => {
  const { state, dispatch } = useWallet();
  const { current: btcPrice } = useBitcoinPrice();
  const { activeModal } = state.ui;
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const closeModal = () => {
    dispatch({ type: 'SET_MODAL', payload: null });
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Top Section - Overview */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <WalletOverview />
          </div>
          <div>
            <PriceChart />
          </div>
        </div>

        {/* Middle Section - Balance and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BalanceCard />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        {/* Bottom Section - Activity and Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <TransactionList onTransactionClick={handleTransactionClick} />
          </div>
          <div className="space-y-6">
            <RecentActivity />
          </div>
        </div>

        {/* Statistics Section */}
        <QuickStats />
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'send'}
        onClose={closeModal}
        title="Send Bitcoin"
        size="md"
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Send form coming in Phase 5!</p>
          <p className="text-sm text-gray-400 mt-2">
            This will include address validation, amount input, and fee selection.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={activeModal === 'receive'}
        onClose={closeModal}
        title="Receive Bitcoin"
        size="md"
      >
        <div className="text-center py-8">
          <p className="text-gray-500">Receive form coming in Phase 6!</p>
          <p className="text-sm text-gray-400 mt-2">
            This will show QR codes and address generation.
          </p>
        </div>
      </Modal>

      <TransactionModal
        transaction={selectedTransaction}
        isOpen={showTransactionModal}
        onClose={closeTransactionModal}
        btcPrice={btcPrice}
      />
    </Layout>
  );
};

export default Dashboard;