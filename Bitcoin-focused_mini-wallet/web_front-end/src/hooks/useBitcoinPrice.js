import { useState, useEffect } from 'react';
import { generateMockPriceData } from '../utils/mockData';

export const useBitcoinPrice = () => {
  const [priceData, setPriceData] = useState({
    current: 43250,
    change24h: 2.34,
    changePercent24h: 5.41,
    priceHistory: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Simulate API call
    const fetchPriceData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const history = generateMockPriceData(30);
        const currentPrice = history[history.length - 1]?.price || 43250;
        const yesterdayPrice = history[history.length - 2]?.price || 42250;
        const change24h = currentPrice - yesterdayPrice;
        const changePercent24h = (change24h / yesterdayPrice) * 100;
        
        setPriceData({
          current: currentPrice,
          change24h,
          changePercent24h,
          priceHistory: history,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setPriceData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchPriceData();

    // Update price every 30 seconds
    const interval = setInterval(() => {
      setPriceData(prev => {
        const volatility = (Math.random() - 0.5) * 0.02; // ±1%
        const newPrice = prev.current * (1 + volatility);
        const change24h = newPrice - (prev.priceHistory[prev.priceHistory.length - 2]?.price || prev.current);
        const changePercent24h = (change24h / prev.current) * 100;
        
        return {
          ...prev,
          current: Math.round(newPrice * 100) / 100,
          change24h,
          changePercent24h
        };
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return priceData;
};