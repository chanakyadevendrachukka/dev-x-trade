import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Share } from 'lucide-react';
import { Stock, formatCurrency, formatPercentage, formatNumber } from '@/utils/stocksApi';
import { TradingDialog } from '@/components/trading/TradingDialog';
import { useRealTrading as useTrading } from '@/hooks/useRealTrading';

interface TradingStockCardProps {
  stock: Stock;
  showChart?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TradingStockCard({ stock, showChart = true, className = '', onClick }: TradingStockCardProps) {
  const { getPosition, user } = useTrading();
  const position = getPosition(stock.symbol);
  const isPositive = stock.changePercent >= 0;

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                {position && (
                  <Badge variant="secondary" className="text-xs">
                    <Share className="h-3 w-3 mr-1" />
                    {position.quantity}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">{stock.name}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl">{formatCurrency(stock.price)}</div>
              <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                <span>{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})</span>
              </div>
            </div>
          </div>

          {/* Stock Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground">Volume</span>
              <div className="font-medium">{formatNumber(stock.volume).replace('$', '')}</div>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground">Market Cap</span>
              <div className="font-medium">{formatNumber(stock.marketCap)}</div>
            </div>
          </div>

          {/* Position Info (if user owns stock) */}
          {position && (
            <div className="p-3 rounded-lg bg-muted/50 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your Position</span>
                <span className="font-medium">{position.quantity} shares</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg Cost</span>
                <span className="font-medium">{formatCurrency(position.averagePrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Value</span>
                <span className="font-medium">{formatCurrency(position.currentValue)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">P&L</span>
                <span className={`font-medium ${position.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(position.unrealizedGainLoss)} ({formatPercentage(position.unrealizedGainLossPercent)})
                </span>
              </div>
            </div>
          )}

          {/* Chart Placeholder */}
          {showChart && (
            <div className="h-24 rounded-lg bg-gradient-to-r from-muted/20 to-muted/40 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-between px-2 pb-2">
                {Array.from({ length: 20 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-t ${isPositive ? 'bg-green-500/60' : 'bg-red-500/60'}`}
                    style={{
                      height: `${Math.random() * 60 + 20}%`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              <BarChart3 className={`h-8 w-8 ${isPositive ? 'text-green-600' : 'text-red-600'} opacity-30`} />
            </div>
          )}

          {/* Trading Actions */}
          {user && (
            <div className="flex gap-2">
              <TradingDialog stock={stock}>
                <Button className="flex-1" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Trade
                </Button>
              </TradingDialog>
              <Button variant="outline" size="sm" className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze
              </Button>
            </div>
          )}

          {/* Call to action for non-authenticated users */}
          {!user && (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">Sign in to start trading</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
