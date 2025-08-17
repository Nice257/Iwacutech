import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import AuthWrapper from './pages/AuthWrapper';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <div className="App">
          <AuthWrapper />
        </div>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;