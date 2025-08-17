// Enhanced mock data for dashboard
export const generateMockPriceData = (days = 7) => {
  const data = [];
  const basePrice = 43250;
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate price volatility
    const volatility = (Math.random() - 0.5) * 0.05; // ±2.5%
    currentPrice += currentPrice * volatility;
    
    data.push({
      date: date.toISOString(),
      price: Math.round(currentPrice * 100) / 100,
      timestamp: date.getTime()
    });
  }
  
  return data;
};

export const generateMockTransactions = (count = 20) => {
  const transactions = [];
  const addresses = [
    'tb1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'tb1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
    'tb1qrp33g7q2c8z8jmzx9p2m5y8d7z3k8n4p5q6r7s8t9u0v1w2x3y4z5',
    'tb1q9vza2e8x573nczrlzms0wvx3gsqjx7vaxqfnuyzt',
  ];
  
  const types = ['sent', 'received'];
  const statuses = ['confirmed', 'pending'];
  
  for (let i = 0; i < count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = i < 3 ? 'pending' : 'confirmed'; // First 3 are pending
    const confirmations = status === 'pending' ? Math.floor(Math.random() * 2) : Math.floor(Math.random() * 100) + 6;
    
    transactions.push({
      id: `tx_${i + 1}`,
      type,
      amount: type === 'sent' ? 
        -(Math.random() * 0.1 + 0.001) : 
        (Math.random() * 0.05 + 0.0001),
      address: addresses[Math.floor(Math.random() * addresses.length)],
      confirmations,
      timestamp: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
      txHash: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      status,
      blockHeight: status === 'confirmed' ? Math.floor(Math.random() * 1000) + 2450000 : null,
      fee: Math.random() * 0.001 + 0.00001,
      size: Math.floor(Math.random() * 300) + 200, // Transaction size in bytes
      category: Math.random() > 0.7 ? 'exchange' : Math.random() > 0.5 ? 'payment' : 'transfer'
    });
  }
  
  return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

export const mockWalletStats = {
  totalTransactions: 156,
  totalReceived: 0.45678901,
  totalSent: 0.31234567,
  averageTransactionSize: 0.00892345,
  firstTransactionDate: Date.now() - (180 * 24 * 60 * 60 * 1000), // 6 months ago
  largestTransaction: 0.12345678,
  smallestTransaction: 0.00001234,
  uniqueAddresses: 23
};

export const mockBitcoinStats = {
  marketCap: 847000000000,
  volume24h: 28500000000,
  dominance: 51.2,
  circulatingSupply: 19678234.5,
  maxSupply: 21000000,
  hashRate: '450.5 EH/s',
  difficulty: 62463471666973.55,
  blockHeight: 815234,
  mempool: 1234
};