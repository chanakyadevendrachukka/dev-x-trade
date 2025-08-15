
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useStockData, useMarketIndices, useCurrencyPairs, 
  mockStocks, mockIndices, mockCurrencies, mockNews,
  generatePriceHistory 
} from '@/utils/stocksApi';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { StockCard } from '@/components/stocks/StockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { MarketOverview } from '@/components/markets/MarketOverview';
import { CurrencyExchange } from '@/components/currencies/CurrencyExchange';
import { NewsCard } from '@/components/news/NewsCard';
import { StatsCard } from '@/components/ui/StatsCard';
import { Background3D } from '@/components/ui/Background3D';
import { BarChart3, TrendingDown, TrendingUp, Wallet2 } from 'lucide-react';

export function Dashboard() {
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
      <Background3D />
      <Navbar />
      
      <div className="flex-1 flex relative z-10 pt-20">
        <Sidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
        
        <main className="flex-1 transition-all duration-300">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="container max-w-full p-4 lg:p-6"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4 mb-8"
            >
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Trading Dashboard
              </motion.h1>
              <motion.div 
                className="flex-1 h-px bg-gradient-to-r from-primary/50 via-primary-glow/30 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
            
            {/* Stats Row with stagger animation */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.3
                  }
                }
              }}
            >
              <motion.div variants={{ 
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}>
                <StatsCard 
                  title="Market Cap" 
                  value="$13.42T"
                  trend={0.47}
                  icon={<Wallet2 />}
                  className="bg-primary/5 border-primary/20"
                />
              </motion.div>
              <motion.div variants={{ 
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}>
                <StatsCard 
                  title="Trading Volume" 
                  value="487.32M"
                  description="Today's volume"
                  icon={<BarChart3 />}
                  className="bg-blue-500/5 border-blue-500/20"
                />
              </motion.div>
              <motion.div variants={{ 
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}>
                <StatsCard 
                  title="Top Gainer" 
                  value={topGainer.symbol}
                  trend={topGainer.changePercent}
                  trendLabel={topGainer.name}
                  icon={<TrendingUp />}
                  className="bg-success/5 border-success/20"
                />
              </motion.div>
              <motion.div variants={{ 
                hidden: { y: 20, opacity: 0 },
                visible: { y: 0, opacity: 1 }
              }}>
                <StatsCard 
                  title="Top Loser" 
                  value={topLoser.symbol}
                  trend={topLoser.changePercent}
                  trendLabel={topLoser.name}
                  icon={<TrendingDown />}
                  className="bg-danger/5 border-danger/20"
                />
              </motion.div>
            </motion.div>
            
            {/* Main Content Layout with sophisticated animations */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.6
                  }
                }
              }}
            >
              {/* Left column - Stock list */}
              <motion.div 
                variants={{
                  hidden: { x: -50, opacity: 0 },
                  visible: { x: 0, opacity: 1 }
                }}
                className="lg:col-span-1 space-y-4"
              >
                <motion.h2 
                  className="text-xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Watchlist
                </motion.h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {stocksWithHistory.slice(0, 5).map((stock, index) => (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <StockCard 
                          stock={stock} 
                          priceHistory={stock.priceHistory}
                          onClick={() => setSelectedStock(stock)}
                          className={selectedStock.symbol === stock.symbol ? 
                            "ring-2 ring-primary shadow-lg shadow-primary/20" : 
                            "hover:shadow-lg transition-shadow duration-300"
                          }
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
              
              {/* Middle column - Chart and news */}
              <motion.div 
                variants={{
                  hidden: { y: 50, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
                className="lg:col-span-2 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <StockChart 
                    symbol={selectedStock.symbol} 
                    name={selectedStock.name} 
                    currentPrice={selectedStock.price}
                    volatility={2.5}
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <NewsCard news={mockNews} className="mt-6" />
                </motion.div>
              </motion.div>
              
              {/* Right column - Markets and currencies */}
              <motion.div 
                variants={{
                  hidden: { x: 50, opacity: 0 },
                  visible: { x: 0, opacity: 1 }
                }}
                className="lg:col-span-1 space-y-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <MarketOverview indices={indices} />
                </motion.div>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <CurrencyExchange currencies={currencies} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
