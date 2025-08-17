import React, { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStocks, searchStocks, type Stock } from '@/utils/stocksApi';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onResultClick?: () => void;
}

export function SearchBar({ 
  className = '', 
  placeholder = "Search markets, currencies...",
  onResultClick 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { stocks, loading } = useStocks();

  // Search results with improved matching
  const searchResults = useMemo(() => {
    if (!query.trim() || loading) return [];
    
    const results = searchStocks(query, stocks);
    
    // Sort by relevance: exact symbol match first, then name matches
    return results
      .sort((a, b) => {
        const queryLower = query.toLowerCase();
        const aSymbolMatch = a.symbol.toLowerCase().startsWith(queryLower);
        const bSymbolMatch = b.symbol.toLowerCase().startsWith(queryLower);
        
        if (aSymbolMatch && !bSymbolMatch) return -1;
        if (!aSymbolMatch && bSymbolMatch) return 1;
        
        // If both or neither match symbol, sort by name relevance
        const aNameMatch = a.name.toLowerCase().indexOf(queryLower);
        const bNameMatch = b.name.toLowerCase().indexOf(queryLower);
        
        if (aNameMatch !== -1 && bNameMatch !== -1) {
          return aNameMatch - bNameMatch;
        }
        if (aNameMatch !== -1) return -1;
        if (bNameMatch !== -1) return 1;
        
        return a.symbol.localeCompare(b.symbol);
      })
      .slice(0, 8); // Limit to 8 results
  }, [query, stocks, loading]);

  // Trending stocks for when no query
  const trendingStocks = useMemo(() => {
    return stocks
      .filter(stock => Math.abs(stock.changePercent) > 2) // Stocks with significant movement
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 6);
  }, [stocks]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < searchResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && searchResults[selectedIndex]) {
            handleStockSelect(searchResults[selectedIndex]);
          } else if (query.trim()) {
            handleSearch();
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, searchResults, query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleStockSelect = (stock: Stock) => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Navigate to stocks page with the selected stock
    navigate(`/stocks?symbol=${stock.symbol}`);
    onResultClick?.();
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Navigate to markets page with search query
    navigate(`/markets?search=${encodeURIComponent(query)}`);
    onResultClick?.();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${changePercent.toFixed(2)}%)`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Delay closing to allow clicking on results
            setTimeout(() => {
              if (!e.currentTarget.contains(document.activeElement)) {
                setIsOpen(false);
                setSelectedIndex(-1);
              }
            }, 200);
          }}
          placeholder={placeholder}
          className="pl-12 pr-4 py-3 bg-card/30 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:bg-card/50 transition-all duration-300 font-mono text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && selectedIndex === -1 && query.trim()) {
              handleSearch();
            }
          }}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3 text-xs"
          >
            Search
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl max-h-96 overflow-y-auto">
              {query.trim() ? (
                <div className="p-4">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="text-sm text-muted-foreground mb-3 font-medium">
                        Search Results for "{query}"
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((stock, index) => (
                          <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`
                              flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                              ${selectedIndex === index 
                                ? 'bg-primary/10 border border-primary/20' 
                                : 'hover:bg-muted/30'
                              }
                            `}
                            onClick={() => handleStockSelect(stock)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                                <span className="text-sm font-bold text-primary">
                                  {stock.symbol.substring(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-48">
                                  {stock.name}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-sm">
                                {formatPrice(stock.price)}
                              </div>
                              <div className={`text-xs ${
                                stock.change >= 0 ? 'text-success' : 'text-destructive'
                              }`}>
                                {formatChange(stock.change, stock.changePercent)}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="h-8 w-8 mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No stocks found for "{query}"</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSearch}
                        className="mt-2"
                      >
                        Search in all markets
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <div className="text-sm text-muted-foreground mb-3 font-medium flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending Stocks
                  </div>
                  <div className="space-y-2">
                    {trendingStocks.map((stock, index) => (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-muted/30 transition-all duration-200"
                        onClick={() => handleStockSelect(stock)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary/20 to-success/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">
                              {stock.symbol.substring(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">
                              {formatPrice(stock.price)}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={stock.change >= 0 ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                  {trendingStocks.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Loading trending stocks...
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
