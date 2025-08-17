// Bitcoin amount formatting
export const formatBTC = (amount, decimals = 8, hideDecimals = false) => {
  if (amount === null || amount === undefined) return '0.00000000';
  
  const formatted = parseFloat(amount).toFixed(hideDecimals ? 2 : decimals);
  return formatted.replace(/\.?0+$/, '') || '0';
};

// Satoshi conversion
export const btcToSatoshi = (btc) => Math.round(btc * 100000000);
export const satoshiToBtc = (sats) => sats / 100000000;

// USD formatting
export const formatUSD = (amount, compact = false) => {
  if (amount === null || amount === undefined) return '$0.00';
  
  if (compact && amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (compact && amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Percentage formatting
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined) return '0.00%';
  return `${parseFloat(value).toFixed(decimals)}%`;
};

// Time formatting
export const formatTime = (timestamp, format = 'relative') => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;

  if (format === 'relative') {
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  }
  
  if (format === 'full') {
    return date.toLocaleString();
  }
  
  return date.toLocaleDateString();
};

// Transaction hash formatting
export const formatTxHash = (hash, length = 8) => {
  if (!hash) return '';
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
};

// Address formatting
export const formatAddress = (address, length = 6) => {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Number animation helpers
export const animateValue = (start, end, duration, callback) => {
  const startTime = performance.now();
  const change = end - start;
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (ease out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = start + (change * easeOut);
    
    callback(current);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};