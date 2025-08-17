// Real Yahoo Finance service using multiple free APIs with fallback to mock data
export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  timestamp: number;
}

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  changePercent24h: number;
  marketCap: number;
  volume24h: number;
  timestamp: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  timestamp: number;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class YahooFinanceService {
  // API Configuration
  private readonly ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_KEY'; // Free tier: 25 requests/day
  private readonly FINNHUB_API_KEY = 'YOUR_FINNHUB_KEY'; // Free tier: 60 calls/minute
  private readonly TWELVE_DATA_API_KEY = 'YOUR_TWELVE_DATA_KEY'; // Free tier: 800 requests/day
  
  // Use demo keys for now (limited functionality)
  private readonly USE_DEMO_KEYS = true;
  
  // API Endpoints
  private readonly ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
  private readonly FINNHUB_BASE = 'https://finnhub.io/api/v1';
  private readonly TWELVE_DATA_BASE = 'https://api.twelvedata.com/v1';
  private readonly COINAPI_BASE = 'https://rest.coinapi.io/v1';
  
  // Cache for API responses (5 minute cache)
  private cache = new Map<string, { data: any; timestamp: number; }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Popular stock symbols
  private readonly popularStocks = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'
  ];

  // Popular crypto symbols
  private readonly popularCrypto = [
    'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD', 'DOGE-USD'
  ];

  // Popular indices
  private readonly popularIndices = [
    '^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'
  ];

  // Base prices for fallback mock data
  private basePrices: Record<string, number> = {
    'AAPL': 187.32,
    'GOOGL': 157.95,
    'MSFT': 402.65,
    'AMZN': 145.86,
    'TSLA': 248.50,
    'META': 312.18,
    'NVDA': 875.25,
    'NFLX': 425.60,
    'AMD': 142.30,
    'INTC': 45.75,
    '^GSPC': 5123.41,
    '^DJI': 38239.98,
    '^IXIC': 16315.19,
    '^RUT': 2089.45,
    '^VIX': 18.25,
    'BTC-USD': 65841.25,
    'ETH-USD': 3487.92,
    'BNB-USD': 521.35,
    'XRP-USD': 0.6123,
    'ADA-USD': 0.4523,
    'SOL-USD': 142.85,
    'DOT-USD': 7.89,
    'DOGE-USD': 0.0823
  };

  // Cache helper methods
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Real API call with error handling and fallback
  private async makeApiCall(url: string, options: RequestInit = {}): Promise<any> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('API call failed, using fallback data:', error);
      throw error;
    }
  }

  // Get single stock quote using real API with fallback
  async getStockQuote(symbol: string): Promise<StockQuote> {
    const cacheKey = `quote_${symbol}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      // Try Finnhub API first (most reliable for real-time quotes)
      if (this.FINNHUB_API_KEY && this.FINNHUB_API_KEY !== 'YOUR_FINNHUB_KEY') {
        const quote = await this.getFinnhubQuote(symbol);
        this.setCachedData(cacheKey, quote);
        return quote;
      }

      // Try Alpha Vantage as backup
      if (this.ALPHA_VANTAGE_API_KEY && this.ALPHA_VANTAGE_API_KEY !== 'YOUR_ALPHA_VANTAGE_KEY') {
        const quote = await this.getAlphaVantageQuote(symbol);
        this.setCachedData(cacheKey, quote);
        return quote;
      }

      // Try free Yahoo Finance proxy
      const quote = await this.getYahooFinanceProxyQuote(symbol);
      this.setCachedData(cacheKey, quote);
      return quote;

    } catch (error) {
      console.warn(`Failed to get real data for ${symbol}, using mock data:`, error);
      // Fallback to enhanced mock data
      return this.getMockStockQuote(symbol);
    }
  }

  // Finnhub API implementation
  private async getFinnhubQuote(symbol: string): Promise<StockQuote> {
    const url = `${this.FINNHUB_BASE}/quote?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    const data = await this.makeApiCall(url);

    const profileUrl = `${this.FINNHUB_BASE}/stock/profile2?symbol=${symbol}&token=${this.FINNHUB_API_KEY}`;
    const profile = await this.makeApiCall(profileUrl).catch(() => ({}));

    return {
      symbol: symbol,
      price: data.c || 0,
      change: (data.c - data.pc) || 0,
      changePercent: ((data.c - data.pc) / data.pc * 100) || 0,
      volume: 0, // Finnhub doesn't provide volume in quote endpoint
      open: data.o || 0,
      high: data.h || 0,
      low: data.l || 0,
      previousClose: data.pc || 0,
      marketCap: profile.marketCapitalization ? profile.marketCapitalization * 1000000 : undefined,
      peRatio: undefined,
      dividendYield: undefined,
      timestamp: Date.now()
    };
  }

  // Alpha Vantage API implementation
  private async getAlphaVantageQuote(symbol: string): Promise<StockQuote> {
    const url = `${this.ALPHA_VANTAGE_BASE}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.ALPHA_VANTAGE_API_KEY}`;
    const data = await this.makeApiCall(url);

    const quote = data['Global Quote'];
    if (!quote) throw new Error('No quote data received');

    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));

    return {
      symbol: symbol,
      price: price,
      change: change,
      changePercent: changePercent,
      volume: parseInt(quote['06. volume']),
      open: parseFloat(quote['02. open']),
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      previousClose: parseFloat(quote['08. previous close']),
      marketCap: undefined,
      peRatio: undefined,
      dividendYield: undefined,
      timestamp: Date.now()
    };
  }

  // Free Yahoo Finance proxy (using yfinance-like API)
  private async getYahooFinanceProxyQuote(symbol: string): Promise<StockQuote> {
    // Using a free proxy service for Yahoo Finance data
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    
    const data = await this.makeApiCall(url);
    
    if (!data.chart?.result?.[0]) {
      throw new Error('No data received from Yahoo Finance');
    }

    const result = data.chart.result[0];
    const meta = result.meta;
    const quote = result.indicators?.quote?.[0];

    if (!meta || !quote) {
      throw new Error('Invalid data structure from Yahoo Finance');
    }

    const currentPrice = meta.regularMarketPrice || meta.previousClose;
    const previousClose = meta.previousClose;
    const change = currentPrice - previousClose;
    const changePercent = (change / previousClose) * 100;

    return {
      symbol: symbol,
      price: currentPrice,
      change: change,
      changePercent: changePercent,
      volume: meta.regularMarketVolume || 0,
      open: meta.regularMarketOpen || currentPrice,
      high: meta.regularMarketDayHigh || currentPrice,
      low: meta.regularMarketDayLow || currentPrice,
      previousClose: previousClose,
      marketCap: meta.marketCap,
      peRatio: meta.trailingPE,
      dividendYield: meta.dividendYield,
      timestamp: Date.now()
    };
  }
  // Popular stock symbols
  private readonly popularStocks = [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'
  ];

  // Popular crypto symbols
  private readonly popularCrypto = [
    'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'ADA-USD', 'SOL-USD', 'DOT-USD', 'DOGE-USD'
  ];

  // Popular indices
  private readonly popularIndices = [
    '^GSPC', '^DJI', '^IXIC', '^RUT', '^VIX'
  ];

  // Base prices for realistic mock data
  private basePrices: Record<string, number> = {
    'AAPL': 187.32,
    'GOOGL': 157.95,
    'MSFT': 402.65,
    'AMZN': 145.86,
    'TSLA': 248.50,
    'META': 312.18,
    'NVDA': 875.25,
    'NFLX': 425.60,
    'AMD': 142.30,
    'INTC': 45.75,
    '^GSPC': 5123.41,
    '^DJI': 38239.98,
    '^IXIC': 16315.19,
    '^RUT': 2089.45,
    '^VIX': 18.25,
    'BTC-USD': 65841.25,
    'ETH-USD': 3487.92,
    'BNB-USD': 521.35,
    'XRP-USD': 0.6123,
    'ADA-USD': 0.4523,
    'SOL-USD': 142.85,
    'DOT-USD': 7.89,
    'DOGE-USD': 0.0823
  };

  // Get single stock quote
  async getStockQuote(symbol: string): Promise<StockQuote> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      const basePrice = this.basePrices[symbol] || 100;
      const price = this.simulatePrice(basePrice);
      const change = price - basePrice;
      const changePercent = (change / basePrice) * 100;
      
      return {
        symbol: symbol,
        price: parseFloat(price.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        open: parseFloat((price * (0.98 + Math.random() * 0.04)).toFixed(2)),
        high: parseFloat((price * (1.01 + Math.random() * 0.02)).toFixed(2)),
        low: parseFloat((price * (0.97 + Math.random() * 0.02)).toFixed(2)),
        previousClose: basePrice,
        marketCap: Math.floor(Math.random() * 2000000000000) + 100000000000,
        peRatio: parseFloat((15 + Math.random() * 20).toFixed(2)),
        dividendYield: parseFloat((Math.random() * 3).toFixed(2)),
        timestamp: Date.now()
      };
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    }
  }

  // Get multiple stock quotes
  async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      const quotes = await Promise.all(symbols.map(symbol => this.getStockQuote(symbol)));
      return quotes;
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  // Get popular stocks
  async getPopularStocks(): Promise<MarketData[]> {
    try {
      const quotes = await this.getMultipleQuotes(this.popularStocks);
      
      return quotes.map(quote => ({
        symbol: quote.symbol,
        name: this.getCompanyName(quote.symbol),
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap,
        timestamp: quote.timestamp
      }));
    } catch (error) {
      console.error('Error fetching popular stocks:', error);
      return this.getMockStockData();
    }
  }

  // Get crypto data
  async getCryptoData(): Promise<CryptoData[]> {
    try {
      const quotes = await this.getMultipleQuotes(this.popularCrypto);
      
      return quotes.map(quote => ({
        symbol: quote.symbol.replace('-USD', ''),
        name: this.getCryptoName(quote.symbol),
        price: quote.price,
        change24h: quote.change,
        changePercent24h: quote.changePercent,
        marketCap: quote.marketCap || 0,
        volume24h: quote.volume,
        timestamp: quote.timestamp
      }));
    } catch (error) {
      console.error('Error fetching crypto data:', error);
      return this.getMockCryptoData();
    }
  }

  // Get market indices
  async getMarketIndices(): Promise<MarketData[]> {
    try {
      const quotes = await this.getMultipleQuotes(this.popularIndices);
      
      return quotes.map(quote => ({
        symbol: quote.symbol,
        name: this.getIndexName(quote.symbol),
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        timestamp: quote.timestamp
      }));
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return this.getMockIndexData();
    }
  }

  // Get historical data
  async getHistoricalData(
    symbol: string, 
    period: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max' = '1y'
  ): Promise<HistoricalData[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      
      const days = this.getPeriodDays(period);
      const basePrice = this.basePrices[symbol] || 100;
      const data: HistoricalData[] = [];
      
      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const volatility = 0.02; // 2% daily volatility
        const drift = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + drift * (days - i) / days);
        
        const open = price * (0.98 + Math.random() * 0.04);
        const close = price * (0.98 + Math.random() * 0.04);
        const high = Math.max(open, close) * (1 + Math.random() * 0.02);
        const low = Math.min(open, close) * (0.98 + Math.random() * 0.02);
        
        data.push({
          date: date.toISOString().split('T')[0],
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 50000000) + 1000000
        });
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  }

  // Search for stocks
  async searchStocks(query: string): Promise<MarketData[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150 + Math.random() * 100));
      
      const allSymbols = [...this.popularStocks, ...this.popularIndices];
      const filteredSymbols = allSymbols.filter(symbol => 
        symbol.toLowerCase().includes(query.toLowerCase()) ||
        this.getCompanyName(symbol).toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10);

      if (filteredSymbols.length === 0) {
        return [];
      }

      const quotes = await this.getMultipleQuotes(filteredSymbols);
      return quotes.map(quote => ({
        symbol: quote.symbol,
        name: this.getCompanyName(quote.symbol),
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap,
        timestamp: quote.timestamp
      }));
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  // Utility functions
  private simulatePrice(basePrice: number): number {
    // Simulate realistic price movement
    const volatility = 0.03; // 3% volatility
    const change = (Math.random() - 0.5) * volatility;
    return basePrice * (1 + change);
  }

  private getPeriodDays(period: string): number {
    const periodMap: Record<string, number> = {
      '1d': 1,
      '5d': 5,
      '1mo': 30,
      '3mo': 90,
      '6mo': 180,
      '1y': 365,
      '2y': 730,
      '5y': 1825,
      '10y': 3650,
      'ytd': Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (24 * 60 * 60 * 1000)),
      'max': 7300
    };
    return periodMap[period] || 365;
  }

  private getCompanyName(symbol: string): string {
    const companyNames: Record<string, string> = {
      'AAPL': 'Apple Inc.',
      'GOOGL': 'Alphabet Inc.',
      'MSFT': 'Microsoft Corporation',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'NVDA': 'NVIDIA Corporation',
      'NFLX': 'Netflix Inc.',
      'AMD': 'Advanced Micro Devices',
      'INTC': 'Intel Corporation',
      '^GSPC': 'S&P 500',
      '^DJI': 'Dow Jones',
      '^IXIC': 'NASDAQ',
      '^RUT': 'Russell 2000',
      '^VIX': 'VIX'
    };
    return companyNames[symbol] || symbol;
  }

  private getCryptoName(symbol: string): string {
    const cryptoNames: Record<string, string> = {
      'BTC-USD': 'Bitcoin',
      'ETH-USD': 'Ethereum',
      'BNB-USD': 'Binance Coin',
      'XRP-USD': 'XRP',
      'ADA-USD': 'Cardano',
      'SOL-USD': 'Solana',
      'DOT-USD': 'Polkadot',
      'DOGE-USD': 'Dogecoin'
    };
    return cryptoNames[symbol] || symbol.replace('-USD', '');
  }

  private getIndexName(symbol: string): string {
    const indexNames: Record<string, string> = {
      '^GSPC': 'S&P 500',
      '^DJI': 'Dow Jones',
      '^IXIC': 'NASDAQ',
      '^RUT': 'Russell 2000',
      '^VIX': 'VIX'
    };
    return indexNames[symbol] || symbol;
  }

  // Fallback mock data
  private getMockStockData(): MarketData[] {
    return this.popularStocks.map(symbol => ({
      symbol,
      name: this.getCompanyName(symbol),
      price: this.simulatePrice(this.basePrices[symbol] || 100),
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      marketCap: Math.floor(Math.random() * 1000000000000) + 100000000000,
      timestamp: Date.now()
    }));
  }

  private getMockCryptoData(): CryptoData[] {
    return [
      { symbol: 'BTC', name: 'Bitcoin', price: this.simulatePrice(65841.25), change24h: (Math.random() - 0.5) * 2000, changePercent24h: (Math.random() - 0.5) * 5, marketCap: 1293000000000, volume24h: 28740000000, timestamp: Date.now() },
      { symbol: 'ETH', name: 'Ethereum', price: this.simulatePrice(3487.92), change24h: (Math.random() - 0.5) * 200, changePercent24h: (Math.random() - 0.5) * 4, marketCap: 418700000000, volume24h: 14280000000, timestamp: Date.now() },
      { symbol: 'BNB', name: 'Binance Coin', price: this.simulatePrice(521.35), change24h: (Math.random() - 0.5) * 30, changePercent24h: (Math.random() - 0.5) * 6, marketCap: 80000000000, volume24h: 1200000000, timestamp: Date.now() }
    ];
  }

  private getMockIndexData(): MarketData[] {
    return [
      { symbol: '^GSPC', name: 'S&P 500', price: this.simulatePrice(5123.41), change: (Math.random() - 0.5) * 50, changePercent: (Math.random() - 0.5) * 1, volume: 0, timestamp: Date.now() },
      { symbol: '^DJI', name: 'Dow Jones', price: this.simulatePrice(38239.98), change: (Math.random() - 0.5) * 200, changePercent: (Math.random() - 0.5) * 1, volume: 0, timestamp: Date.now() },
      { symbol: '^IXIC', name: 'NASDAQ', price: this.simulatePrice(16315.19), change: (Math.random() - 0.5) * 150, changePercent: (Math.random() - 0.5) * 1.5, volume: 0, timestamp: Date.now() }
    ];
  }
}

export const yahooFinanceService = new YahooFinanceService();
export default yahooFinanceService;
