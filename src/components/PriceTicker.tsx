import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { fetchPrices } from '../services/api';
import { useTranslation } from 'react-i18next';

const PriceTicker: React.FC = () => {
  const { fiat } = useStore();
  const { t } = useTranslation();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const coins = ['BTC', 'ETH', 'DOGE', 'SOL', 'XRP', 'ADA'];

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchPrices(coins, [fiat]);
        setPrices(data);
      } catch (error) {
        console.error('Failed to fetch prices', error);
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
    const interval = setInterval(loadPrices, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, [fiat]);

  if (loading) return <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>;

  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2 shadow-inner">
      <div className="inline-flex space-x-8 animate-marquee whitespace-nowrap">
        {coins.map((coin) => (
          <div key={coin} className="flex items-center space-x-2">
            <span className="font-bold text-yellow-400">{coin}</span>
            <span className="text-sm text-gray-300">
              {prices[coin]?.[fiat]?.toLocaleString(undefined, {
                style: 'currency',
                currency: fiat,
              }) || 'Loading...'}
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {coins.map((coin) => (
          <div key={`${coin}-dup`} className="flex items-center space-x-2">
            <span className="font-bold text-yellow-400">{coin}</span>
            <span className="text-sm text-gray-300">
              {prices[coin]?.[fiat]?.toLocaleString(undefined, {
                style: 'currency',
                currency: fiat,
              }) || 'Loading...'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceTicker;
