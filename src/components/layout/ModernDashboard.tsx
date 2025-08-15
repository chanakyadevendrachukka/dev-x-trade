import React, { useState } from 'react';
import { 
  useStockData, useMarketIndices, useCurrencyPairs, 
  mockStocks, mockIndices, mockCurrencies, mockNews,
  generatePriceHistory 
} from '@/utils/stocksApi';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ModernStockCard } from '@/components/stocks/ModernStockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { ModernMarketOverview } from '@/components/markets/ModernMarketOverview';
import { CurrencyExchange } from '@/components/currencies/CurrencyExchange';
import { NewsCard } from '@/components/news/NewsCard';
import { ModernStatsCard } from '@/components/ui/ModernStatsCard';
import { BarChart3, TrendingDown, TrendingUp, Wallet2, Activity, Globe } from 'lucide-react';

export function ModernDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  
  // Use our hooks to get real-time mock data
  const stocks = useStockData(mockStocks);
  const indices = useMarketIndices(mockIndices);
  const currencies = useCurrencyPairs(mockCurrencies);
  
  // Generate chart data for the selected stock
  const selectedStockHistory = generatePriceHistory(30, selectedStock.price, 2);
  
  // Generate chart data for stock cards
  const stocksWithHistory = stocks.map(stock => {
    return {
      ...stock,
      priceHistory: generatePriceHistory(30, stock.price, 2)
    };
  });
  
  // Calculate market statistics
  const gainers = stocks.filter(stock => stock.changePercent > 0);
  const losers = stocks.filter(stock => stock.changePercent < 0);
  
  const topGainer = [...stocks].sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = [...stocks].sort((a, b) => a.changePercent - b.changePercent)[0];
  
  const totalMarketCap = stocks.reduce((sum, stock) => sum + stock.marketCap, 0);
  const totalVolume = stocks.reduce((sum, stock) => sum + stock.volume, 0);
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" style={{ background: 'var(--gradient-bg)' }} />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-gentle" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-pulse-gentle" 
               style={{ animationDelay: '2s' }} />
        </div>
      </div>
      
      <Navbar />
      
      <div className="flex-1 flex">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 transition-all duration-500">
          <div className="container max-w-full p-4 lg:p-8">
            {/* Hero Section */}
            <div className="relative mb-12 animate-fade-in">
              <div className="text-center space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent animate-slide-up">
                  DevXTrade
                </h1>
                <p className="text-xl text-muted-foreground animate-slide-up" style={{ animationDelay: '200ms' }}>
                  Advanced Trading Analytics & Market Intelligence
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50" />
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50" />
                </div>
              </div>
            </div>
            
            {/* Enhanced Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <ModernStatsCard 
                title="Global Market Cap" 
                value="$13.42T"
                trend={0.47}
                icon={<Wallet2 />}
                className="animate-slide-up"
                style={{ animationDelay: '100ms' }}
              />
              <ModernStatsCard 
                title="Trading Volume" 
                value="487.32M"
                description="24h Volume"
                icon={<BarChart3 />}
                className="animate-slide-up"
                style={{ animationDelay: '200ms' }}
              />
              <ModernStatsCard 
                title="Top Performer" 
                value={topGainer.symbol}
                trend={topGainer.changePercent}
                trendLabel={topGainer.name}
                icon={<TrendingUp />}
                variant="success"
                className="animate-slide-up"
                style={{ animationDelay: '300ms' }}
              />
              <ModernStatsCard 
                title="Market Mover" 
                value={topLoser.symbol}
                trend={topLoser.changePercent}
                trendLabel={topLoser.name}
                icon={<TrendingDown />}
                variant="danger"
                className="animate-slide-up"
                style={{ animationDelay: '400ms' }}
              />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
              {/* Watchlist */}
              <div className="xl:col-span-3 space-y-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Live Watchlist</h2>
                  </div>
                  <div className="space-y-4">
                    {stocksWithHistory.slice(0, 5).map((stock, index) => (
                      <ModernStockCard 
                        key={stock.symbol} 
                        stock={stock} 
                        priceHistory={stock.priceHistory}
                        onClick={() => setSelectedStock(stock)}
                        isSelected={selectedStock.symbol === stock.symbol}
                        className="animate-slide-up"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Chart Area */}
              <div className="xl:col-span-6 space-y-6 animate-slide-up" style={{ animationDelay: '600ms' }}>
                <div className="glass-card p-6 rounded-2xl">
                  <StockChart 
                    symbol={selectedStock.symbol} 
                    name={selectedStock.name} 
                    currentPrice={selectedStock.price}
                    volatility={2.5}
                  />
                </div>
                <div className="glass-card p-6 rounded-2xl">
                  <NewsCard news={mockNews} />
                </div>
              </div>
              
              {/* Market Overview & Currencies */}
              <div className="xl:col-span-3 space-y-6 animate-slide-up" style={{ animationDelay: '700ms' }}>
                <div className="glass-card p-6 rounded-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold">Global Markets</h2>
                  </div>
                  <ModernMarketOverview indices={indices} />
                </div>
                
                <div className="glass-card p-6 rounded-2xl">
                  <CurrencyExchange currencies={currencies} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}