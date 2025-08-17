import { useState, useEffect, useCallback } from 'react';

export const useWebSocket = (url = null, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  // Mock WebSocket for development
  useEffect(() => {
    if (!url) {
      // Simulate connection
      setIsConnected(true);
      
      // Simulate incoming messages
      const intervals = [
        // Balance updates
        setInterval(() => {
          const mockMessage = {
            type: 'balance_update',
            data: {
              balance: Math.random() * 0.1 + 0.01,
              unconfirmed: Math.random() * 0.01,
              timestamp: Date.now()
            }
          };
          setMessages(prev => [...prev.slice(-9), mockMessage]);
        }, 45000), // Every 45 seconds

        // Transaction confirmations
        setInterval(() => {
          const mockMessage = {
            type: 'transaction_confirmed',
            data: {
              txHash: Math.random().toString(36).substring(2, 15),
              confirmations: Math.floor(Math.random() * 6) + 1,
              timestamp: Date.now()
            }
          };
          setMessages(prev => [...prev.slice(-9), mockMessage]);
        }, 60000), // Every minute

        // New transactions
        setInterval(() => {
          if (Math.random() > 0.8) { // 20% chance
            const mockMessage = {
              type: 'new_transaction',
              data: {
                type: Math.random() > 0.5 ? 'received' : 'sent',
                amount: Math.random() * 0.01 + 0.001,
                address: `tb1q${Math.random().toString(36).substring(2, 15)}`,
                timestamp: Date.now()
              }
            };
            setMessages(prev => [...prev.slice(-9), mockMessage]);
          }
        }, 30000) // Every 30 seconds
      ];

      return () => {
        intervals.forEach(clearInterval);
        setIsConnected(false);
      };
    }

    // Real WebSocket implementation would go here
    // const ws = new WebSocket(url);
    // ws.onopen = () => setIsConnected(true);
    // etc...

  }, [url]);

  const sendMessage = useCallback((message) => {
    // Mock send
    console.log('Mock WebSocket send:', message);
  }, []);

  return {
    isConnected,
    messages,
    error,
    sendMessage
  };
};