import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Stock } from '@/utils/stocksApi';

export interface Trade {
  id: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
}

export interface Position {
  symbol: string;
  stockName: string;
  quantity: number;
  averagePrice: number;
  totalInvested: number;
  currentPrice: number;
  currentValue: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPercent: number;
}

export interface Portfolio {
  userId: string;
  cash: number;
  totalValue: number;
  totalInvested: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  positions: Position[];
  lastUpdated: Date;
}

export interface UserTradingProfile {
  userId: string;
  totalTrades: number;
  createdAt: Date;
  lastTradeAt: Date | null;
}

export function useRealTrading() {
  const [user, authLoading] = useAuthState(auth);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [userProfile, setUserProfile] = useState<UserTradingProfile | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const INITIAL_CASH = 100000; // $100,000 starting cash

  useEffect(() => {
    if (user && !authLoading) {
      initializeUser();
      loadUserData();
      setupRealtimeListeners();
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
      
      // Check if user profile exists
      const profileDoc = await getDoc(doc(db, 'users', user.uid));
      if (!profileDoc.exists()) {
        // Create new user profile
        const newProfile: UserTradingProfile = {
          userId: user.uid,
          totalTrades: 0,
          createdAt: new Date(),
          lastTradeAt: null
        };
        
        await setDoc(doc(db, 'users', user.uid), {
          ...newProfile,
          createdAt: Timestamp.fromDate(newProfile.createdAt)
        });
        
        setUserProfile(newProfile);
        
        // Create initial portfolio
        const newPortfolio: Portfolio = {
          userId: user.uid,
          cash: INITIAL_CASH,
          totalValue: INITIAL_CASH,
          totalInvested: 0,
          totalGainLoss: 0,
          totalGainLossPercent: 0,
          positions: [],
          lastUpdated: new Date()
        };
        
        await setDoc(doc(db, 'portfolios', user.uid), {
          ...newPortfolio,
          lastUpdated: Timestamp.fromDate(newPortfolio.lastUpdated)
        });
        
        setPortfolio(newPortfolio);
      } else {
        const profileData = profileDoc.data();
        setUserProfile({
          ...profileData,
          createdAt: profileData.createdAt.toDate(),
          lastTradeAt: profileData.lastTradeAt ? profileData.lastTradeAt.toDate() : null
        } as UserTradingProfile);
      }
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
      
      // Load portfolio
      const portfolioDoc = await getDoc(doc(db, 'portfolios', user.uid));
      if (portfolioDoc.exists()) {
        const portfolioData = portfolioDoc.data();
        setPortfolio({
          ...portfolioData,
          lastUpdated: portfolioData.lastUpdated.toDate()
        } as Portfolio);
      }
      
      // Load trades
      const tradesQuery = query(
        collection(db, 'trades'),
        where('userId', '==', user.uid)
      );
      
      const tradesSnapshot = await getDocs(tradesQuery);
      const tradesData = tradesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as Trade[];
      
      // Sort on client side to avoid index requirement  
      tradesData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTrades(tradesData);
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeListeners = () => {
    if (!user) return;

    // Listen to portfolio changes
    const portfolioUnsubscribe = onSnapshot(
      doc(db, 'portfolios', user.uid),
      (doc) => {
        if (doc.exists()) {
          const portfolioData = doc.data();
          setPortfolio({
            ...portfolioData,
            lastUpdated: portfolioData.lastUpdated.toDate()
          } as Portfolio);
        }
      },
      (error) => {
        console.error('Portfolio listener error:', error);
      }
    );

    // Listen to trades changes
    const tradesQuery = query(
      collection(db, 'trades'),
      where('userId', '==', user.uid)
    );
    
    const tradesUnsubscribe = onSnapshot(
      tradesQuery,
      (snapshot) => {
        const tradesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as Trade[];
        // Sort on client side to avoid index requirement
        tradesData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setTrades(tradesData);
      },
      (error) => {
        console.error('Trades listener error:', error);
      }
    );

    return () => {
      portfolioUnsubscribe();
      tradesUnsubscribe();
    };
  };

  const buyStock = async (stock: Stock, quantity: number): Promise<{ success: boolean; message: string }> => {
    if (!user || !portfolio) {
      return { success: false, message: 'User not authenticated or portfolio not loaded' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const totalCost = stock.price * quantity;
      
      if (portfolio.cash < totalCost) {
        return { success: false, message: 'Insufficient funds' };
      }

      // Create trade record
      const trade: Omit<Trade, 'id'> = {
        userId: user.uid,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'BUY',
        quantity,
        price: stock.price,
        totalAmount: totalCost,
        timestamp: new Date()
      };

      // Add trade to Firestore
      const tradeDocRef = await addDoc(collection(db, 'trades'), {
        ...trade,
        timestamp: Timestamp.fromDate(trade.timestamp)
      });

      // Update portfolio
      const updatedPortfolio = { ...portfolio };
      updatedPortfolio.cash -= totalCost;
      
      // Update or create position
      const existingPositionIndex = updatedPortfolio.positions.findIndex(p => p.symbol === stock.symbol);
      if (existingPositionIndex >= 0) {
        const existingPosition = updatedPortfolio.positions[existingPositionIndex];
        const newTotalShares = existingPosition.quantity + quantity;
        const newTotalInvested = existingPosition.totalInvested + totalCost;
        
        updatedPortfolio.positions[existingPositionIndex] = {
          ...existingPosition,
          quantity: newTotalShares,
          averagePrice: newTotalInvested / newTotalShares,
          totalInvested: newTotalInvested,
          currentPrice: stock.price,
          currentValue: newTotalShares * stock.price,
          unrealizedGainLoss: (newTotalShares * stock.price) - newTotalInvested,
          unrealizedGainLossPercent: ((newTotalShares * stock.price) - newTotalInvested) / newTotalInvested * 100
        };
      } else {
        const newPosition: Position = {
          symbol: stock.symbol,
          stockName: stock.name,
          quantity,
          averagePrice: stock.price,
          totalInvested: totalCost,
          currentPrice: stock.price,
          currentValue: quantity * stock.price,
          unrealizedGainLoss: 0,
          unrealizedGainLossPercent: 0
        };
        updatedPortfolio.positions.push(newPosition);
      }

      // Update portfolio totals
      updatePortfolioTotals(updatedPortfolio);
      
      // Save updated portfolio to Firestore
      await updateDoc(doc(db, 'portfolios', user.uid), {
        ...updatedPortfolio,
        lastUpdated: Timestamp.fromDate(updatedPortfolio.lastUpdated)
      });

      // Update user profile
      const updatedProfile = { ...userProfile! };
      updatedProfile.totalTrades += 1;
      updatedProfile.lastTradeAt = new Date();
      
      await updateDoc(doc(db, 'users', user.uid), {
        totalTrades: updatedProfile.totalTrades,
        lastTradeAt: Timestamp.fromDate(updatedProfile.lastTradeAt)
      });

      return { success: true, message: 'Buy order executed successfully' };
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
    if (!user || !portfolio) {
      return { success: false, message: 'User not authenticated or portfolio not loaded' };
    }

    try {
      setLoading(true);
      setError(null);
      
      const position = portfolio.positions.find(p => p.symbol === stock.symbol);
      if (!position) {
        return { success: false, message: 'No position found for this stock' };
      }

      if (position.quantity < quantity) {
        return { success: false, message: 'Insufficient shares to sell' };
      }

      const totalProceeds = stock.price * quantity;

      // Create trade record
      const trade: Omit<Trade, 'id'> = {
        userId: user.uid,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'SELL',
        quantity,
        price: stock.price,
        totalAmount: totalProceeds,
        timestamp: new Date()
      };

      // Add trade to Firestore
      await addDoc(collection(db, 'trades'), {
        ...trade,
        timestamp: Timestamp.fromDate(trade.timestamp)
      });

      // Update portfolio
      const updatedPortfolio = { ...portfolio };
      updatedPortfolio.cash += totalProceeds;

      // Update position
      const positionIndex = updatedPortfolio.positions.findIndex(p => p.symbol === stock.symbol);
      if (position.quantity === quantity) {
        // Remove position entirely
        updatedPortfolio.positions.splice(positionIndex, 1);
      } else {
        // Reduce position
        const sharesAfterSale = position.quantity - quantity;
        const investmentSold = (quantity / position.quantity) * position.totalInvested;
        
        updatedPortfolio.positions[positionIndex] = {
          ...position,
          quantity: sharesAfterSale,
          totalInvested: position.totalInvested - investmentSold,
          currentPrice: stock.price,
          currentValue: sharesAfterSale * stock.price,
          unrealizedGainLoss: (sharesAfterSale * stock.price) - (position.totalInvested - investmentSold),
          unrealizedGainLossPercent: ((sharesAfterSale * stock.price) - (position.totalInvested - investmentSold)) / (position.totalInvested - investmentSold) * 100
        };
      }

      // Update portfolio totals
      updatePortfolioTotals(updatedPortfolio);
      
      // Save updated portfolio to Firestore
      await updateDoc(doc(db, 'portfolios', user.uid), {
        ...updatedPortfolio,
        lastUpdated: Timestamp.fromDate(updatedPortfolio.lastUpdated)
      });

      // Update user profile
      const updatedProfile = { ...userProfile! };
      updatedProfile.totalTrades += 1;
      updatedProfile.lastTradeAt = new Date();
      
      await updateDoc(doc(db, 'users', user.uid), {
        totalTrades: updatedProfile.totalTrades,
        lastTradeAt: Timestamp.fromDate(updatedProfile.lastTradeAt)
      });

      return { success: true, message: 'Sell order executed successfully' };
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
    if (!user || !portfolio) return;

    try {
      const updatedPortfolio = { ...portfolio };
      let hasChanges = false;

      updatedPortfolio.positions.forEach(position => {
        const currentStock = stocks.find(s => s.symbol === position.symbol);
        if (currentStock && currentStock.price !== position.currentPrice) {
          position.currentPrice = currentStock.price;
          position.currentValue = position.quantity * currentStock.price;
          position.unrealizedGainLoss = position.currentValue - position.totalInvested;
          position.unrealizedGainLossPercent = position.totalInvested > 0 ? (position.unrealizedGainLoss / position.totalInvested) * 100 : 0;
          hasChanges = true;
        }
      });

      if (hasChanges) {
        updatePortfolioTotals(updatedPortfolio);
        
        await updateDoc(doc(db, 'portfolios', user.uid), {
          ...updatedPortfolio,
          lastUpdated: Timestamp.fromDate(updatedPortfolio.lastUpdated)
        });
      }
    } catch (err) {
      console.error('Failed to update portfolio with current prices:', err);
    }
  };

  const updatePortfolioTotals = (portfolio: Portfolio): void => {
    portfolio.totalInvested = portfolio.positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
    const totalPositionValue = portfolio.positions.reduce((sum, pos) => sum + pos.currentValue, 0);
    portfolio.totalValue = portfolio.cash + totalPositionValue;
    portfolio.totalGainLoss = portfolio.positions.reduce((sum, pos) => sum + pos.unrealizedGainLoss, 0);
    portfolio.totalGainLossPercent = portfolio.totalInvested > 0 ? (portfolio.totalGainLoss / portfolio.totalInvested) * 100 : 0;
    portfolio.lastUpdated = new Date();
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
