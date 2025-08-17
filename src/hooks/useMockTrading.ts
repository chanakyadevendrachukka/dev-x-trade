import { useState, useEffect } from 'react';
import { useMockAuth } from '@/hooks/useMockAuth';
import { mockTradingService, Trade, Portfolio, UserTradingProfile } from '@/services/mockTradingService';
import { Stock } from '@/utils/stocksApi';

export function useMockTrading() {
  const { user, loading: authLoading } = useMockAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [userProfile, setUserProfile] = useState<UserTradingProfile | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      initializeUser();
      loadUserData();
    } else {
      setPortfolio(null);
      setUserProfile(null);
      setTrades([]);
    }
  }, [user, authLoading]);

  const initializeUser = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const profile = await mockTradingService.initializeUserProfile(user);
      setUserProfile(profile);
    } catch (err) {
      setError('Failed to initialize user profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const [portfolioData, tradesData] = await Promise.all([
        mockTradingService.getPortfolio(user.uid),
        mockTradingService.getUserTrades(user.uid)
      ]);
      
      setPortfolio(portfolioData);
      setTrades(tradesData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async (stock: Stock, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await mockTradingService.executeBuyOrder(user.uid, stock, quantity);
      
      if (result.success) {
        await loadUserData(); // Refresh data
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const message = 'Failed to execute buy order';
      setError(message);
      console.error(err);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const sellStock = async (stock: Stock, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      setLoading(true);
      setError(null);
      const result = await mockTradingService.executeSellOrder(user.uid, stock, quantity);
      
      if (result.success) {
        await loadUserData(); // Refresh data
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      const message = 'Failed to execute sell order';
      setError(message);
      console.error(err);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioWithCurrentPrices = async (stocks: Stock[]) => {
    if (!user) return;

    try {
      await mockTradingService.updatePortfolioWithCurrentPrices(user.uid, stocks);
      const updatedPortfolio = await mockTradingService.getPortfolio(user.uid);
      setPortfolio(updatedPortfolio);
    } catch (err) {
      console.error('Failed to update portfolio with current prices:', err);
    }
  };

  const getPosition = (symbol: string) => {
    return portfolio?.positions.find(pos => pos.symbol === symbol) || null;
  };

  const canAfford = (stock: Stock, quantity: number): boolean => {
    if (!portfolio) return false;
    return portfolio.cash >= (stock.price * quantity);
  };

  const hasPosition = (symbol: string): boolean => {
    return getPosition(symbol) !== null;
  };

  const getPositionQuantity = (symbol: string): number => {
    return getPosition(symbol)?.quantity || 0;
  };

  return {
    user,
    portfolio,
    userProfile,
    trades,
    loading: loading || authLoading,
    error,
    buyStock,
    sellStock,
    updatePortfolioWithCurrentPrices,
    getPosition,
    canAfford,
    hasPosition,
    getPositionQuantity
  };
}
