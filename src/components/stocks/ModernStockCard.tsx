import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import { Stock, formatCurrency, formatPercentage, formatNumber } from '@/utils/stocksApi';
import { Sparkline } from '@/components/stocks/Sparkline';
import { cn } from '@/lib/utils';

interface ModernStockCardProps {
  stock: Stock;
  priceHistory?: number[];
  isSelected?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function ModernStockCard({ 
  stock, 
  priceHistory, 
  isSelected, 
  className, 
  style, 
  onClick 
}: ModernStockCardProps) {
  const isPositive = stock.change >= 0;
  
  return (
    <div 
      className={cn(
        'premium-card p-4 rounded-xl backdrop-blur-xl border border-white/10',
        'transition-all duration-500 ease-out hover:scale-[1.02] hover:-translate-y-1',
        'cursor-pointer group relative overflow-hidden',
        isSelected && 'ring-2 ring-primary shadow-glow',
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-glow" />
      )}
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{stock.symbol}</h3>
            <div className={cn(
              'w-6 h-6 rounded-full flex items-center justify-center',
              isPositive ? 'bg-success/20' : 'bg-danger/20'
            )}>
              {isPositive ? 
                <TrendingUpIcon className="h-3 w-3 text-success" /> : 
                <TrendingDownIcon className="h-3 w-3 text-danger" />
              }
            </div>
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
            {stock.name}
          </p>
        </div>
        
        {/* Mini Chart */}
        <div className="w-16 h-8">
          {priceHistory && priceHistory.length > 0 && (
            <Sparkline 
              data={priceHistory} 
              color={isPositive ? '#10b981' : '#ef4444'}
            />
          )}
        </div>
      </div>
      
      {/* Price */}
      <div className="mb-3">
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {formatCurrency(stock.price)}
        </div>
        <div className={cn(
          'flex items-center gap-1 text-sm font-medium',
          isPositive ? 'text-success' : 'text-danger'
        )}>
          {isPositive ? 
            <ArrowUpIcon className="h-3 w-3" /> : 
            <ArrowDownIcon className="h-3 w-3" />
          }
          {formatCurrency(Math.abs(stock.change))} ({formatPercentage(stock.changePercent)})
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <div>Volume</div>
        <div className="text-right font-medium">{formatNumber(stock.volume)}</div>
        <div>Market Cap</div>
        <div className="text-right font-medium">{formatNumber(stock.marketCap)}</div>
      </div>
      
      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-primary-glow/5 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}