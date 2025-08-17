import { useState, useEffect, useCallback } from 'react';
import { yahooFinanceService, MarketData, CryptoData, StockQuote, HistoricalData } from '@/services/yahooFinanceService';

export function useMarketData(refreshInterval = 30000) {
  const [stockData, setStockData] = useState<MarketData[]>([]);
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [indexData, setIndexData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketData = useCallback(async () => {
    try {
      setError(null);
      
      const [stocks, crypto, indices] = await Promise.allSettled([
        yahooFinanceService.getPopularStocks(),
        yahooFinanceService.getCryptoData(),
        yahooFinanceService.getMarketIndices()
      ]);

      if (stocks.status === 'fulfilled') {
        setStockData(stocks.value);
      }
      
      if (crypto.status === 'fulfilled') {
        setCryptoData(crypto.value);
      }
      
      if (indices.status === 'fulfilled') {
        setIndexData(indices.value);
      }

      // If all failed, show error
      if (stocks.status === 'rejected' && crypto.status === 'rejected' && indices.status === 'rejected') {
        setError('Failed to fetch market data');
      }
    } catch (err) {
      setError('Failed to fetch market data');
      console.error('Market data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
    
    const interval = setInterval(fetchMarketData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchMarketData, refreshInterval]);

  return {
    stockData,
    cryptoData,
    indexData,
    loading,
    error,
    refetch: fetchMarketData
  };
}

export function useStockQuote(symbol: string, refreshInterval = 10000) {
  const [data, setData] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setError(null);
      const quote = await yahooFinanceService.getStockQuote(symbol);
      setData(quote);
    } catch (err) {
      setError(`Failed to fetch quote for ${symbol}`);
      console.error('Stock quote fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchQuote();
    
    const interval = setInterval(fetchQuote, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchQuote, refreshInterval]);

  return { data, loading, error, refetch: fetchQuote };
}

export function useHistoricalData(
  symbol: string, 
  period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' = '1y'
) {
  const [data, setData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricalData = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      const historicalData = await yahooFinanceService.getHistoricalData(symbol, period);
      setData(historicalData);
    } catch (err) {
      setError(`Failed to fetch historical data for ${symbol}`);
      console.error('Historical data fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [symbol, period]);

  useEffect(() => {
    fetchHistoricalData();
  }, [fetchHistoricalData]);

  return { data, loading, error, refetch: fetchHistoricalData };
}

export function useStockSearch() {
  const [results, setResults] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchStocks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const searchResults = await yahooFinanceService.searchStocks(query);
      setResults(searchResults);
    } catch (err) {
      setError('Failed to search stocks');
      console.error('Stock search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    error,
    searchStocks,
    clearResults: () => setResults([])
  };
}
