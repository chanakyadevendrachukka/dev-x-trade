
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon, TrendingUp, TrendingDown } from 'lucide-react';
import { Stock, formatCurrency, formatPercentage, formatNumber, formatDate } from '@/utils/stocksApi';
import { Sparkline } from '@/components/stocks/Sparkline';
import { cn } from '@/lib/utils';

interface StockCardProps {
  stock: Stock;
  priceHistory?: number[];
  className?: string;
  onClick?: () => void;
}

export function StockCard({ stock, priceHistory, className, onClick }: StockCardProps) {
  const isPositive = stock.change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-500 group relative",
          "bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-border/50",
          "hover:shadow-premium hover:border-primary/20",
          onClick ? "cursor-pointer" : "",
        )}
        onClick={onClick}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Trend indicator line */}
        <motion.div
          className={cn(
            "absolute top-0 left-0 right-0 h-1",
            isPositive ? "bg-success" : "bg-danger"
          )}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
          <div className="space-y-1">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <CardTitle className="text-base font-semibold leading-none holographic-text">
                {stock.symbol}
              </CardTitle>
            </motion.div>
            <motion.p
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs text-muted-foreground truncate max-w-[180px]"
            >
              {stock.name}
            </motion.p>
          </div>
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-2xl font-bold"
              >
                {formatCurrency(stock.price)}
              </motion.div>
              
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center text-xs"
              >
                <motion.span 
                  className={cn(
                    "inline-flex items-center font-medium",
                    isPositive ? "text-success" : "text-danger"
                  )}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <motion.div
                    animate={{ rotate: isPositive ? [0, 10, 0] : [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {isPositive ? 
                      <TrendingUp className="h-3 w-3 mr-1" /> : 
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                  </motion.div>
                  {formatCurrency(Math.abs(stock.change))} ({formatPercentage(stock.changePercent)})
                </motion.span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-1 text-xs"
              >
                <div className="text-muted-foreground">Volume:</div>
                <div className="text-right font-medium">{formatNumber(stock.volume)}</div>
                <div className="text-muted-foreground">Mkt Cap:</div>
                <div className="text-right font-medium">{formatNumber(stock.marketCap)}</div>
                <div className="text-muted-foreground">Updated:</div>
                <div className="text-right font-medium">{formatDate(stock.lastUpdated)}</div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="h-24 relative"
            >
              {priceHistory && priceHistory.length > 0 && (
                <div className="relative h-full">
                  <Sparkline 
                    data={priceHistory} 
                    color={isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'}
                  />
                  
                  {/* Glow effect for chart */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 rounded opacity-20",
                      isPositive ? "bg-success" : "bg-danger"
                    )}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              )}
            </motion.div>
          </div>
        </CardContent>
        
        {/* Border glow on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg border border-primary/20 opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full opacity-60",
                isPositive ? "bg-success" : "bg-danger"
              )}
              initial={{ 
                x: Math.random() * 100 + "%",
                y: "100%",
                opacity: 0
              }}
              animate={{
                y: "-10%",
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
