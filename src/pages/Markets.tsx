
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { MarketOverview } from '@/components/markets/MarketOverview';
import { SearchBar } from '@/components/search/SearchBar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketIndices, useStocks, searchStocks } from '@/utils/stocksApi';
import { Search, Filter, TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react';

const Markets = () => {
  const [searchParams] = useSearchParams();
  const { indices, loading: indicesLoading, error: indicesError } = useMarketIndices();
  const { stocks, loading: stocksLoading, error: stocksError } = useStocks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'symbol' | 'price' | 'change' | 'volume'>('change');
  
  // Handle URL search parameter
  const urlSearch = searchParams.get('search');
  
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  // Filter and sort stocks based on search and sort criteria
  const filteredStocks = searchStocks(searchQuery, stocks)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.price - a.price;
        case 'change':
          return Math.abs(b.changePercent) - Math.abs(a.changePercent);
        case 'volume':
          return b.volume - a.volume;
        default:
          return a.symbol.localeCompare(b.symbol);
      }
    });

  const marketStats = {
    gainers: stocks.filter(s => s.changePercent > 0).length,
    losers: stocks.filter(s => s.changePercent < 0).length,
    totalStocks: stocks.length,
    avgChange: stocks.length > 0 ? stocks.reduce((sum, s) => sum + s.changePercent, 0) / stocks.length : 0
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) {
      return `${(volume / 1e9).toFixed(1)}B`;
    } else if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    } else {
      return volume.toLocaleString();
    }
  };
  
  return (
    <PageLayout title="AI Market Intelligence">
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Market Overview */}
        <MarketOverview indices={indices} />
        
        {/* Market Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-2xl font-bold">{marketStats.totalStocks}</h3>
                <p className="text-sm text-muted-foreground">Total Stocks</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <h3 className="text-2xl font-bold text-success">{marketStats.gainers}</h3>
                <p className="text-sm text-muted-foreground">Gainers</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-8 w-8 text-destructive" />
              <div>
                <h3 className="text-2xl font-bold text-destructive">{marketStats.losers}</h3>
                <p className="text-sm text-muted-foreground">Losers</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <h3 className={`text-2xl font-bold ${marketStats.avgChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                </h3>
                <p className="text-sm text-muted-foreground">Avg Change</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <SearchBar 
                className="w-full"
                placeholder="Search stocks by symbol or company name..."
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                <option value="symbol">Sort by Symbol</option>
                <option value="price">Sort by Price</option>
                <option value="change">Sort by Change</option>
                <option value="volume">Sort by Volume</option>
              </select>
            </div>
          </div>

          {searchQuery && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                Search Results for "{searchQuery}" ({filteredStocks.length} stocks)
              </h3>
            </div>
          )}

          {/* Stock Results */}
          <div className="space-y-3">
            {stocksLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading stocks...</p>
              </div>
            ) : filteredStocks.length > 0 ? (
              <>
                {filteredStocks.slice(0, searchQuery ? 50 : 20).map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          {stock.symbol.substring(0, 3)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-48">
                          {stock.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Vol: {formatVolume(stock.volume)} • Cap: {formatMarketCap(stock.marketCap)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {formatPrice(stock.price)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={stock.change >= 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                        </Badge>
                        <Badge 
                          variant={stock.changePercent >= 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {filteredStocks.length > (searchQuery ? 50 : 20) && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      Showing {searchQuery ? 50 : 20} of {filteredStocks.length} stocks
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No stocks found{searchQuery ? ` for "${searchQuery}"` : ''}</p>
                {searchQuery && (
                  <Button
                    variant="ghost"
                    onClick={() => setSearchQuery('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Major Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {indices.map((index) => (
            <motion.div 
              key={index.symbol} 
              className="bg-card rounded-lg p-6 shadow border border-border"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-lg">{index.name}</h3>
                  <p className="text-muted-foreground text-sm">{index.region}</p>
                </div>
                <Badge 
                  variant={index.changePercent >= 0 ? 'default' : 'destructive'}
                  className="text-sm"
                >
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </Badge>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold">{index.value.toFixed(2)}</span>
                <span className={`ml-2 ${index.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Last updated: {new Date(index.lastUpdated).toLocaleTimeString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default Markets;
