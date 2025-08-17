
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useStocks, searchStocks, getStockBySymbol } from '@/utils/stocksApi';
import { TradingStockCard } from '@/components/trading/TradingStockCard';
import { StockChart } from '@/components/stocks/StockChart';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';

const Stocks = () => {
  const [searchParams] = useSearchParams();
  const { stocks, loading, error } = useStocks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change'>('symbol');
  
  // Handle URL search parameter
  const urlSymbol = searchParams.get('symbol');
  const [selectedStock, setSelectedStock] = useState(null);

  // Update selected stock when URL parameter changes or stocks load
  useEffect(() => {
    if (urlSymbol && stocks.length > 0) {
      const foundStock = getStockBySymbol(urlSymbol, stocks);
      if (foundStock) {
        setSelectedStock(foundStock);
      }
    } else if (stocks.length > 0 && !selectedStock) {
      setSelectedStock(stocks[0]);
    }
  }, [urlSymbol, stocks, selectedStock]);

  // Generate mock price history for charts
  const generatePriceHistory = (days: number, currentPrice: number, volatility: number) => {
    const history = [];
    let price = currentPrice * 0.95; // Start slightly lower
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some random walk
      const change = (Math.random() - 0.5) * volatility;
      price += change;
      
      history.push({
        date: date.toISOString().split('T')[0],
        open: price,
        high: price * (1 + Math.random() * 0.02),
        low: price * (1 - Math.random() * 0.02),
        close: price,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return history;
  };
  
  const stocksWithHistory = stocks.map(stock => {
    return {
      ...stock,
      priceHistory: generatePriceHistory(30, stock.price, 2)
    };
  });

  const filteredStocks = stocksWithHistory
    .filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change':
          return b.changePercent - a.changePercent;
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

  const marketStats = {
    gainers: stocks.filter(s => s.changePercent > 0).length,
    losers: stocks.filter(s => s.changePercent < 0).length,
    totalVolume: stocks.reduce((sum, s) => sum + s.volume, 0),
    avgChange: stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length
  };
  
  return (
    <PageLayout title="AI Stock Intelligence">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Market Overview Stats */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="AI Recommendations"
              value={marketStats.gainers}
              icon={<TrendingUp />}
              className="bg-success/5 border-success/20"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Risk Alerts"
              value={marketStats.losers}
              icon={<TrendingDown />}
              className="bg-danger/5 border-danger/20"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="AI Analyzed Volume"
              value={`${(marketStats.totalVolume / 1000000).toFixed(1)}M`}
              icon={<BarChart3 />}
              className="bg-blue-500/5 border-blue-500/20"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Prediction Accuracy"
              value="94.7%"
              trend={2.3}
              icon={<DollarSign />}
              className="bg-primary/5 border-primary/20"
            />
          </motion.div>
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 backdrop-blur-sm border-border/50"
            />
          </div>
          
          <div className="flex gap-2">
            {['symbol', 'price', 'change'].map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy(sort as any)}
                className="capitalize"
              >
                {sort}
              </Button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock List */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1 space-y-4"
          >
            <h2 className="text-xl font-semibold holographic-text">
              All Stocks ({filteredStocks.length})
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              <AnimatePresence>
                {filteredStocks.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TradingStockCard 
                      stock={stock} 
                      onClick={() => setSelectedStock(stock)}
                      className={selectedStock?.symbol === stock.symbol ? 
                        "ring-2 ring-primary shadow-lg shadow-primary/20" : 
                        ""
                      }
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
          
          {/* Chart and Details */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="lg:col-span-2 space-y-6"
          >
            {selectedStock ? (
              <>
                <motion.div
                  key={selectedStock.symbol}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <StockChart 
                    symbol={selectedStock.symbol} 
                    name={selectedStock.name} 
                    currentPrice={selectedStock.price}
                    volatility={2.5}
                  />
                </motion.div>
                
                {/* Detailed Stats */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BarChart3 className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm text-muted-foreground">Market Cap</h3>
                    </div>
                    <p className="text-2xl font-bold">
                      ${(selectedStock.marketCap / 1000000000).toFixed(2)}B
                    </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Market Capitalization
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <h3 className="font-medium text-sm text-muted-foreground">Volume</h3>
                </div>
                <p className="text-2xl font-bold">
                  {(selectedStock.volume / 1000000).toFixed(2)}M
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Trading Volume
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-success/10">
                    <DollarSign className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="font-medium text-sm text-muted-foreground">52W Range</h3>
                </div>
                <p className="text-2xl font-bold">
                  ${(selectedStock.price * 0.8).toFixed(2)} - ${(selectedStock.price * 1.2).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  52 Week Range
                </p>
              </motion.div>
            </motion.div>
              </>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading stock data...</p>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Stocks;
