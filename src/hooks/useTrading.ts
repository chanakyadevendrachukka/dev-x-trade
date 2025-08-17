import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { tradingService, Trade, Portfolio, UserTradingProfile } from '@/services/tradingService';
import { Stock } from '@/utils/stocksApi';

export function useTrading() {
  const [user] = useAuthState(auth);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [userProfile, setUserProfile] = useState<UserTradingProfile | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      initializeUser();
      loadUserData();
    } else {
      setPortfolio(null);
      setUserProfile(null);
      setTrades([]);
    }
  }, [user]);

  const initializeUser = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profile = await tradingService.initializeUserProfile(user);
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
      const [portfolioData, tradesData] = await Promise.all([
        tradingService.getPortfolio(user.uid),
        tradingService.getUserTrades(user.uid)
      ]);
      
      setPortfolio(portfolioData);
      setTrades(tradesData);
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async (stock: Stock, quantity: number): Promise<Trade | null> => {
    if (!user || !portfolio) {
      setError('User not authenticated or portfolio not loaded');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if user can afford the purchase
      if (!tradingService.canAffordToBuy(portfolio, stock, quantity)) {
        throw new Error('Insufficient funds');
      }

      const trade = await tradingService.executeBuyOrder(stock, quantity);
      
      // Reload user data
      await loadUserData();
      
      return trade;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy stock';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const sellStock = async (stock: Stock, quantity: number): Promise<Trade | null> => {
    if (!user || !portfolio) {
      setError('User not authenticated or portfolio not loaded');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // Check if user has enough shares
      if (!tradingService.canSell(portfolio, stock.symbol, quantity)) {
        throw new Error('Insufficient shares');
      }

      const trade = await tradingService.executeSellOrder(stock, quantity);
      
      // Reload user data
      await loadUserData();
      
      return trade;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sell stock';
      setError(errorMessage);
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioWithCurrentPrices = async (currentStocks: Stock[]): Promise<void> => {
    if (!user) return;

    try {
      const updatedPortfolio = await tradingService.updatePortfolioWithCurrentPrices(user.uid, currentStocks);
      setPortfolio(updatedPortfolio);
    } catch (err) {
      console.error('Failed to update portfolio with current prices:', err);
    }
  };

  const getPosition = (symbol: string) => {
    if (!portfolio) return null;
    return tradingService.getPosition(portfolio, symbol);
  };

  const canAffordToBuy = (stock: Stock, quantity: number): boolean => {
    if (!portfolio) return false;
    return tradingService.canAffordToBuy(portfolio, stock, quantity);
  };

  const canSell = (symbol: string, quantity: number): boolean => {
    if (!portfolio) return false;
    return tradingService.canSell(portfolio, symbol, quantity);
  };

  const refreshData = () => {
    if (user) {
      loadUserData();
    }
  };

  return {
    user,
    portfolio,
    userProfile,
    trades,
    loading,
    error,
    buyStock,
    sellStock,
    updatePortfolioWithCurrentPrices,
    getPosition,
    canAffordToBuy,
    canSell,
    refreshData,
    clearError: () => setError(null)
  };
}
