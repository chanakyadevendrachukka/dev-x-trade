import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  Timestamp 
} from 'firebase/firestore';
import { Stock } from '@/utils/stocksApi';

export interface Trade {
  id?: string;
  userId: string;
  symbol: string;
  stockName: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  totalAmount: number;
  timestamp: Date;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
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
  email: string;
  displayName: string;
  cash: number;
  totalPortfolioValue: number;
  totalTrades: number;
  joinedAt: Date;
  lastActive: Date;
}

class TradingService {
  private readonly TRADES_COLLECTION = 'trades';
  private readonly PORTFOLIOS_COLLECTION = 'portfolios';
  private readonly USERS_COLLECTION = 'trading_users';
  private readonly INITIAL_CASH = 100000; // $100,000 starting cash

  // Initialize user trading profile
  async initializeUserProfile(user: any): Promise<UserTradingProfile> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const newProfile: UserTradingProfile = {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Anonymous',
          cash: this.INITIAL_CASH,
          totalPortfolioValue: this.INITIAL_CASH,
          totalTrades: 0,
          joinedAt: new Date(),
          lastActive: new Date()
        };
        
        await setDoc(userRef, {
          ...newProfile,
          joinedAt: Timestamp.fromDate(newProfile.joinedAt),
          lastActive: Timestamp.fromDate(newProfile.lastActive)
        });
        
        // Initialize empty portfolio
        await this.initializePortfolio(user.uid);
        
        return newProfile;
      } else {
        const data = userDoc.data();
        return {
          ...data,
          joinedAt: data.joinedAt.toDate(),
          lastActive: data.lastActive.toDate()
        } as UserTradingProfile;
      }
    } catch (error) {
      console.error('Error initializing user profile:', error);
      throw error;
    }
  }

  // Initialize empty portfolio
  private async initializePortfolio(userId: string): Promise<void> {
    try {
      const portfolioRef = doc(db, this.PORTFOLIOS_COLLECTION, userId);
      const initialPortfolio = {
        userId,
        cash: this.INITIAL_CASH,
        totalValue: this.INITIAL_CASH,
        totalInvested: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        positions: [],
        lastUpdated: Timestamp.fromDate(new Date())
      };
      
      await setDoc(portfolioRef, initialPortfolio);
    } catch (error) {
      console.error('Error initializing portfolio:', error);
      throw error;
    }
  }

  // Execute a buy order
  async executeBuyOrder(stock: Stock, quantity: number): Promise<Trade> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const totalCost = stock.price * quantity;
    
    try {
      // Check if user has enough cash
      const portfolio = await this.getPortfolio(user.uid);
      if (portfolio.cash < totalCost) {
        throw new Error('Insufficient funds');
      }

      // Create trade record
      const trade: Trade = {
        userId: user.uid,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'BUY',
        quantity,
        price: stock.price,
        totalAmount: totalCost,
        timestamp: new Date(),
        status: 'COMPLETED'
      };

      // Add trade to Firestore
      const tradeRef = await addDoc(collection(db, this.TRADES_COLLECTION), {
        ...trade,
        timestamp: Timestamp.fromDate(trade.timestamp)
      });

      trade.id = tradeRef.id;

      // Update portfolio
      await this.updatePortfolioAfterTrade(user.uid, trade, stock);

      // Update user stats
      await this.updateUserStats(user.uid);

      return trade;
    } catch (error) {
      console.error('Error executing buy order:', error);
      throw error;
    }
  }

  // Execute a sell order
  async executeSellOrder(stock: Stock, quantity: number): Promise<Trade> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    try {
      // Check if user has enough shares
      const portfolio = await this.getPortfolio(user.uid);
      const position = portfolio.positions.find(p => p.symbol === stock.symbol);
      
      if (!position || position.quantity < quantity) {
        throw new Error('Insufficient shares');
      }

      const totalRevenue = stock.price * quantity;

      // Create trade record
      const trade: Trade = {
        userId: user.uid,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'SELL',
        quantity,
        price: stock.price,
        totalAmount: totalRevenue,
        timestamp: new Date(),
        status: 'COMPLETED'
      };

      // Add trade to Firestore
      const tradeRef = await addDoc(collection(db, this.TRADES_COLLECTION), {
        ...trade,
        timestamp: Timestamp.fromDate(trade.timestamp)
      });

      trade.id = tradeRef.id;

      // Update portfolio
      await this.updatePortfolioAfterTrade(user.uid, trade, stock);

      // Update user stats
      await this.updateUserStats(user.uid);

      return trade;
    } catch (error) {
      console.error('Error executing sell order:', error);
      throw error;
    }
  }

  // Update portfolio after trade
  private async updatePortfolioAfterTrade(userId: string, trade: Trade, currentStock: Stock): Promise<void> {
    try {
      const portfolio = await this.getPortfolio(userId);
      const portfolioRef = doc(db, this.PORTFOLIOS_COLLECTION, userId);

      if (trade.type === 'BUY') {
        // Reduce cash
        portfolio.cash -= trade.totalAmount;
        
        // Update or add position
        const existingPositionIndex = portfolio.positions.findIndex(p => p.symbol === trade.symbol);
        
        if (existingPositionIndex >= 0) {
          const position = portfolio.positions[existingPositionIndex];
          const newQuantity = position.quantity + trade.quantity;
          const newTotalInvested = position.totalInvested + trade.totalAmount;
          
          portfolio.positions[existingPositionIndex] = {
            ...position,
            quantity: newQuantity,
            averagePrice: newTotalInvested / newQuantity,
            totalInvested: newTotalInvested,
            currentPrice: currentStock.price,
            currentValue: newQuantity * currentStock.price,
            unrealizedGainLoss: (newQuantity * currentStock.price) - newTotalInvested,
            unrealizedGainLossPercent: (((newQuantity * currentStock.price) - newTotalInvested) / newTotalInvested) * 100
          };
        } else {
          portfolio.positions.push({
            symbol: trade.symbol,
            stockName: trade.stockName,
            quantity: trade.quantity,
            averagePrice: trade.price,
            totalInvested: trade.totalAmount,
            currentPrice: currentStock.price,
            currentValue: trade.quantity * currentStock.price,
            unrealizedGainLoss: (trade.quantity * currentStock.price) - trade.totalAmount,
            unrealizedGainLossPercent: (((trade.quantity * currentStock.price) - trade.totalAmount) / trade.totalAmount) * 100
          });
        }
      } else { // SELL
        // Add cash
        portfolio.cash += trade.totalAmount;
        
        // Update position
        const positionIndex = portfolio.positions.findIndex(p => p.symbol === trade.symbol);
        if (positionIndex >= 0) {
          const position = portfolio.positions[positionIndex];
          const soldValue = trade.quantity * position.averagePrice;
          
          position.quantity -= trade.quantity;
          position.totalInvested -= soldValue;
          
          if (position.quantity === 0) {
            portfolio.positions.splice(positionIndex, 1);
          } else {
            position.currentValue = position.quantity * currentStock.price;
            position.unrealizedGainLoss = position.currentValue - position.totalInvested;
            position.unrealizedGainLossPercent = (position.unrealizedGainLoss / position.totalInvested) * 100;
          }
        }
      }

      // Recalculate portfolio totals
      portfolio.totalInvested = portfolio.positions.reduce((sum, p) => sum + p.totalInvested, 0);
      const totalPositionsValue = portfolio.positions.reduce((sum, p) => sum + p.currentValue, 0);
      portfolio.totalValue = portfolio.cash + totalPositionsValue;
      portfolio.totalGainLoss = totalPositionsValue - portfolio.totalInvested;
      portfolio.totalGainLossPercent = portfolio.totalInvested > 0 ? (portfolio.totalGainLoss / portfolio.totalInvested) * 100 : 0;
      portfolio.lastUpdated = new Date();

      await updateDoc(portfolioRef, {
        cash: portfolio.cash,
        totalValue: portfolio.totalValue,
        totalInvested: portfolio.totalInvested,
        totalGainLoss: portfolio.totalGainLoss,
        totalGainLossPercent: portfolio.totalGainLossPercent,
        positions: portfolio.positions,
        lastUpdated: Timestamp.fromDate(portfolio.lastUpdated)
      });
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }

  // Get user portfolio
  async getPortfolio(userId: string): Promise<Portfolio> {
    try {
      const portfolioRef = doc(db, this.PORTFOLIOS_COLLECTION, userId);
      const portfolioDoc = await getDoc(portfolioRef);
      
      if (!portfolioDoc.exists()) {
        await this.initializePortfolio(userId);
        return this.getPortfolio(userId);
      }
      
      const data = portfolioDoc.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated.toDate()
      } as Portfolio;
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw error;
    }
  }

  // Get user trades
  async getUserTrades(userId: string, limit: number = 50): Promise<Trade[]> {
    try {
      const tradesQuery = query(
        collection(db, this.TRADES_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc')
      );

      return new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(tradesQuery, (snapshot) => {
          const trades: Trade[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            trades.push({
              id: doc.id,
              ...data,
              timestamp: data.timestamp.toDate()
            } as Trade);
          });
          resolve(trades.slice(0, limit));
        }, reject);
      });
    } catch (error) {
      console.error('Error getting user trades:', error);
      throw error;
    }
  }

  // Update user trading stats
  private async updateUserStats(userId: string): Promise<void> {
    try {
      const userRef = doc(db, this.USERS_COLLECTION, userId);
      const portfolio = await this.getPortfolio(userId);
      const trades = await this.getUserTrades(userId);

      await updateDoc(userRef, {
        totalPortfolioValue: portfolio.totalValue,
        totalTrades: trades.length,
        lastActive: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
      throw error;
    }
  }

  // Update portfolio positions with current market prices
  async updatePortfolioWithCurrentPrices(userId: string, currentStocks: Stock[]): Promise<Portfolio> {
    try {
      const portfolio = await this.getPortfolio(userId);
      const portfolioRef = doc(db, this.PORTFOLIOS_COLLECTION, userId);

      // Update each position with current market price
      portfolio.positions = portfolio.positions.map(position => {
        const currentStock = currentStocks.find(s => s.symbol === position.symbol);
        if (currentStock) {
          const currentValue = position.quantity * currentStock.price;
          const unrealizedGainLoss = currentValue - position.totalInvested;
          const unrealizedGainLossPercent = (unrealizedGainLoss / position.totalInvested) * 100;

          return {
            ...position,
            currentPrice: currentStock.price,
            currentValue,
            unrealizedGainLoss,
            unrealizedGainLossPercent
          };
        }
        return position;
      });

      // Recalculate portfolio totals
      const totalPositionsValue = portfolio.positions.reduce((sum, p) => sum + p.currentValue, 0);
      portfolio.totalValue = portfolio.cash + totalPositionsValue;
      portfolio.totalGainLoss = totalPositionsValue - portfolio.totalInvested;
      portfolio.totalGainLossPercent = portfolio.totalInvested > 0 ? (portfolio.totalGainLoss / portfolio.totalInvested) * 100 : 0;
      portfolio.lastUpdated = new Date();

      // Update in Firestore
      await updateDoc(portfolioRef, {
        totalValue: portfolio.totalValue,
        totalGainLoss: portfolio.totalGainLoss,
        totalGainLossPercent: portfolio.totalGainLossPercent,
        positions: portfolio.positions,
        lastUpdated: Timestamp.fromDate(portfolio.lastUpdated)
      });

      return portfolio;
    } catch (error) {
      console.error('Error updating portfolio with current prices:', error);
      throw error;
    }
  }

  // Check if user can afford to buy
  canAffordToBuy(portfolio: Portfolio, stock: Stock, quantity: number): boolean {
    const totalCost = stock.price * quantity;
    return portfolio.cash >= totalCost;
  }

  // Check if user has enough shares to sell
  canSell(portfolio: Portfolio, symbol: string, quantity: number): boolean {
    const position = portfolio.positions.find(p => p.symbol === symbol);
    return position ? position.quantity >= quantity : false;
  }

  // Get position for a specific stock
  getPosition(portfolio: Portfolio, symbol: string): Position | null {
    return portfolio.positions.find(p => p.symbol === symbol) || null;
  }
}

export const tradingService = new TradingService();
