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

class MockTradingService {
  private readonly STORAGE_KEYS = {
    PORTFOLIO: 'trading_portfolio',
    TRADES: 'trading_trades',
    USER_PROFILE: 'trading_profile'
  };

  private readonly INITIAL_CASH = 100000; // $100,000 starting cash

  async initializeUserProfile(user: { uid: string }): Promise<UserTradingProfile> {
    const existingProfile = this.getUserProfile(user.uid);
    if (existingProfile) {
      return existingProfile;
    }

    const profile: UserTradingProfile = {
      userId: user.uid,
      totalTrades: 0,
      createdAt: new Date(),
      lastTradeAt: null
    };

    this.saveUserProfile(profile);

    // Initialize portfolio
    const portfolio: Portfolio = {
      userId: user.uid,
      cash: this.INITIAL_CASH,
      totalValue: this.INITIAL_CASH,
      totalInvested: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      positions: [],
      lastUpdated: new Date()
    };

    this.savePortfolio(portfolio);
    return profile;
  }

  async getPortfolio(userId: string): Promise<Portfolio | null> {
    const portfolioData = localStorage.getItem(`${this.STORAGE_KEYS.PORTFOLIO}_${userId}`);
    if (!portfolioData) return null;

    const portfolio = JSON.parse(portfolioData);
    // Convert date strings back to Date objects
    portfolio.lastUpdated = new Date(portfolio.lastUpdated);
    return portfolio;
  }

  async getUserTrades(userId: string): Promise<Trade[]> {
    const tradesData = localStorage.getItem(`${this.STORAGE_KEYS.TRADES}_${userId}`);
    if (!tradesData) return [];

    const trades = JSON.parse(tradesData);
    // Convert date strings back to Date objects
    return trades.map((trade: any) => ({
      ...trade,
      timestamp: new Date(trade.timestamp)
    }));
  }

  async executeBuyOrder(userId: string, stock: Stock, quantity: number): Promise<{ success: boolean; message: string }> {
    try {
      const portfolio = await this.getPortfolio(userId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const totalCost = stock.price * quantity;
      
      if (portfolio.cash < totalCost) {
        return { success: false, message: 'Insufficient funds' };
      }

      // Create trade record
      const trade: Trade = {
        id: Date.now().toString(),
        userId,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'BUY',
        quantity,
        price: stock.price,
        totalAmount: totalCost,
        timestamp: new Date()
      };

      // Update portfolio
      portfolio.cash -= totalCost;
      
      // Update or create position
      const existingPosition = portfolio.positions.find(p => p.symbol === stock.symbol);
      if (existingPosition) {
        const newTotalShares = existingPosition.quantity + quantity;
        const newTotalInvested = existingPosition.totalInvested + totalCost;
        existingPosition.averagePrice = newTotalInvested / newTotalShares;
        existingPosition.quantity = newTotalShares;
        existingPosition.totalInvested = newTotalInvested;
        existingPosition.currentPrice = stock.price;
        existingPosition.currentValue = newTotalShares * stock.price;
        existingPosition.unrealizedGainLoss = existingPosition.currentValue - existingPosition.totalInvested;
        existingPosition.unrealizedGainLossPercent = (existingPosition.unrealizedGainLoss / existingPosition.totalInvested) * 100;
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
        portfolio.positions.push(newPosition);
      }

      this.updatePortfolioTotals(portfolio);
      this.savePortfolio(portfolio);
      this.saveTrade(trade);
      this.updateUserProfile(userId, trade);

      return { success: true, message: 'Buy order executed successfully' };
    } catch (error) {
      console.error('Buy order error:', error);
      return { success: false, message: 'Failed to execute buy order' };
    }
  }

  async executeSellOrder(userId: string, stock: Stock, quantity: number): Promise<{ success: boolean; message: string }> {
    try {
      const portfolio = await this.getPortfolio(userId);
      if (!portfolio) {
        throw new Error('Portfolio not found');
      }

      const position = portfolio.positions.find(p => p.symbol === stock.symbol);
      if (!position) {
        return { success: false, message: 'No position found for this stock' };
      }

      if (position.quantity < quantity) {
        return { success: false, message: 'Insufficient shares to sell' };
      }

      const totalProceeds = stock.price * quantity;

      // Create trade record
      const trade: Trade = {
        id: Date.now().toString(),
        userId,
        symbol: stock.symbol,
        stockName: stock.name,
        type: 'SELL',
        quantity,
        price: stock.price,
        totalAmount: totalProceeds,
        timestamp: new Date()
      };

      // Update portfolio
      portfolio.cash += totalProceeds;

      // Update position
      if (position.quantity === quantity) {
        // Remove position entirely
        portfolio.positions = portfolio.positions.filter(p => p.symbol !== stock.symbol);
      } else {
        // Reduce position
        const sharesAfterSale = position.quantity - quantity;
        const investmentSold = (quantity / position.quantity) * position.totalInvested;
        
        position.quantity = sharesAfterSale;
        position.totalInvested -= investmentSold;
        position.currentPrice = stock.price;
        position.currentValue = sharesAfterSale * stock.price;
        position.unrealizedGainLoss = position.currentValue - position.totalInvested;
        position.unrealizedGainLossPercent = position.totalInvested > 0 ? (position.unrealizedGainLoss / position.totalInvested) * 100 : 0;
      }

      this.updatePortfolioTotals(portfolio);
      this.savePortfolio(portfolio);
      this.saveTrade(trade);
      this.updateUserProfile(userId, trade);

      return { success: true, message: 'Sell order executed successfully' };
    } catch (error) {
      console.error('Sell order error:', error);
      return { success: false, message: 'Failed to execute sell order' };
    }
  }

  async updatePortfolioWithCurrentPrices(userId: string, stocks: Stock[]): Promise<void> {
    const portfolio = await this.getPortfolio(userId);
    if (!portfolio) return;

    portfolio.positions.forEach(position => {
      const currentStock = stocks.find(s => s.symbol === position.symbol);
      if (currentStock) {
        position.currentPrice = currentStock.price;
        position.currentValue = position.quantity * currentStock.price;
        position.unrealizedGainLoss = position.currentValue - position.totalInvested;
        position.unrealizedGainLossPercent = position.totalInvested > 0 ? (position.unrealizedGainLoss / position.totalInvested) * 100 : 0;
      }
    });

    this.updatePortfolioTotals(portfolio);
    this.savePortfolio(portfolio);
  }

  private updatePortfolioTotals(portfolio: Portfolio): void {
    portfolio.totalInvested = portfolio.positions.reduce((sum, pos) => sum + pos.totalInvested, 0);
    const totalPositionValue = portfolio.positions.reduce((sum, pos) => sum + pos.currentValue, 0);
    portfolio.totalValue = portfolio.cash + totalPositionValue;
    portfolio.totalGainLoss = portfolio.positions.reduce((sum, pos) => sum + pos.unrealizedGainLoss, 0);
    portfolio.totalGainLossPercent = portfolio.totalInvested > 0 ? (portfolio.totalGainLoss / portfolio.totalInvested) * 100 : 0;
    portfolio.lastUpdated = new Date();
  }

  private savePortfolio(portfolio: Portfolio): void {
    localStorage.setItem(`${this.STORAGE_KEYS.PORTFOLIO}_${portfolio.userId}`, JSON.stringify(portfolio));
  }

  private saveTrade(trade: Trade): void {
    const trades = this.getUserTradesSync(trade.userId);
    trades.push(trade);
    localStorage.setItem(`${this.STORAGE_KEYS.TRADES}_${trade.userId}`, JSON.stringify(trades));
  }

  private getUserTradesSync(userId: string): Trade[] {
    const tradesData = localStorage.getItem(`${this.STORAGE_KEYS.TRADES}_${userId}`);
    if (!tradesData) return [];
    return JSON.parse(tradesData).map((trade: any) => ({
      ...trade,
      timestamp: new Date(trade.timestamp)
    }));
  }

  private getUserProfile(userId: string): UserTradingProfile | null {
    const profileData = localStorage.getItem(`${this.STORAGE_KEYS.USER_PROFILE}_${userId}`);
    if (!profileData) return null;
    
    const profile = JSON.parse(profileData);
    return {
      ...profile,
      createdAt: new Date(profile.createdAt),
      lastTradeAt: profile.lastTradeAt ? new Date(profile.lastTradeAt) : null
    };
  }

  private saveUserProfile(profile: UserTradingProfile): void {
    localStorage.setItem(`${this.STORAGE_KEYS.USER_PROFILE}_${profile.userId}`, JSON.stringify(profile));
  }

  private updateUserProfile(userId: string, trade: Trade): void {
    const profile = this.getUserProfile(userId);
    if (profile) {
      profile.totalTrades += 1;
      profile.lastTradeAt = trade.timestamp;
      this.saveUserProfile(profile);
    }
  }
}

export const mockTradingService = new MockTradingService();
