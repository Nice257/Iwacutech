import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Bitcoin, BarChart3 } from 'lucide-react';
import { useBitcoinPrice } from '../../hooks/useBitcoinPrice';
import { formatUSD, formatPercentage } from '../../utils/formatters';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';

const PriceChart = () => {
  const { current, change24h, changePercent24h, priceHistory, isLoading } = useBitcoinPrice();
  const [timeframe, setTimeframe] = useState('24H');
  
  const isPositive = change24h >= 0;
  
  const timeframes = ['1H', '24H', '7D', '30D'];

  // Simple price chart using SVG
  const renderChart = () => {
    if (!priceHistory.length) return null;

    const width = 300;
    const height = 80;
    const padding = 20;
    
    const prices = priceHistory.slice(-24).map(d => d.price); // Last 24 data points
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    
    const points = prices.map((price, index) => {
      const x = padding + (index * (width - 2 * padding)) / (prices.length - 1);
      const y = height - padding - ((price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="w-full h-20">
        <defs>
          <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity="0.05"/>
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          points={points}
        />
        <polyline
          fill="url(#priceGradient)"
          points={`${points} ${width - padding},${height - padding} ${padding},${height - padding}`}
        />
      </svg>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-2 text-gray-500">Loading price data...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Bitcoin className="h-5 w-5 text-bitcoin-500" />
          <h3 className="text-lg font-semibold text-gray-900">Bitcoin Price</h3>
        </div>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {/* Current Price */}
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatUSD(current)}
            </span>
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}{formatUSD(change24h)} ({formatPercentage(changePercent24h)})
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">24h change</p>
        </div>

        {/* Price Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          {renderChart()}
        </div>

        {/* Timeframe Selector */}
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                timeframe === tf
                  ? 'bg-bitcoin-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PriceChart;