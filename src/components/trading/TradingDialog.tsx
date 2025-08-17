import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, TrendingDown, DollarSign, Share, AlertTriangle } from 'lucide-react';
import { Stock } from '@/utils/stocksApi';
import { useRealTrading as useTrading } from '@/hooks/useRealTrading';
import { formatCurrency, formatPercentage } from '@/utils/stocksApi';

interface TradingDialogProps {
  stock: Stock;
  children: React.ReactNode;
}

export function TradingDialog({ stock, children }: TradingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [isConfirming, setIsConfirming] = useState(false);
  
  const {
    user,
    portfolio,
    buyStock,
    sellStock,
    getPosition,
    canAfford,
    hasPosition,
    getPositionQuantity,
    loading,
    error
  } = useTrading();

  const position = getPosition(stock.symbol);
  const totalCost = stock.price * quantity;
  const maxAffordable = portfolio ? Math.floor(portfolio.cash / stock.price) : 0;
  const maxSellable = position ? position.quantity : 0;

  // Helper functions
  const canAffordToBuy = (stock: Stock, qty: number) => canAfford(stock, qty);
  const canSellStock = (symbol: string, qty: number) => hasPosition(symbol) && getPositionQuantity(symbol) >= qty;
  const clearError = () => {
    // Error will be cleared on next action
  };

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 0;
    if (tradeType === 'BUY') {
      setQuantity(Math.min(Math.max(0, num), maxAffordable));
    } else {
      setQuantity(Math.min(Math.max(0, num), maxSellable));
    }
  };

  const handleMaxClick = () => {
    if (tradeType === 'BUY') {
      setQuantity(maxAffordable);
    } else {
      setQuantity(maxSellable);
    }
  };

  const handleTrade = async () => {
    if (!portfolio || quantity <= 0) return;

    setIsConfirming(true);
    try {
      let success = false;
      
      if (tradeType === 'BUY') {
        const trade = await buyStock(stock, quantity);
        success = !!trade;
      } else {
        const trade = await sellStock(stock, quantity);
        success = !!trade;
      }

      if (success) {
        setIsOpen(false);
        setQuantity(1);
        setIsConfirming(false);
        clearError();
      }
    } catch (err) {
      console.error('Trade failed:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  const canExecuteTrade = () => {
    if (quantity <= 0) return false;
    if (tradeType === 'BUY') {
      return canAffordToBuy(stock, quantity);
    } else {
      return canSellStock(stock.symbol, quantity);
    }
  };

  const getTradeButtonText = () => {
    if (isConfirming) return tradeType === 'BUY' ? 'Buying...' : 'Selling...';
    if (tradeType === 'BUY') {
      if (!canAffordToBuy(stock, quantity)) return 'Insufficient Funds';
      return `Buy ${quantity} Share${quantity !== 1 ? 's' : ''}`;
    } else {
      if (!canSellStock(stock.symbol, quantity)) return 'Insufficient Shares';
      return `Sell ${quantity} Share${quantity !== 1 ? 's' : ''}`;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Trade {stock.symbol}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Stock Info */}
          <div className="p-4 rounded-lg bg-muted/50 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">{stock.symbol}</h3>
                <p className="text-sm text-muted-foreground truncate">{stock.name}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">{formatCurrency(stock.price)}</div>
                <div className={`flex items-center text-sm ${stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stock.changePercent >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {formatPercentage(stock.changePercent)}
                </div>
              </div>
            </div>
          </div>

          {/* Current Position */}
          {position && (
            <div className="p-4 rounded-lg border border-border/50 space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Share className="h-4 w-4" />
                Current Position
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Shares:</span>
                  <span className="font-medium ml-2">{position.quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Avg Price:</span>
                  <span className="font-medium ml-2">{formatCurrency(position.averagePrice)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Value:</span>
                  <span className="font-medium ml-2">{formatCurrency(position.currentValue)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">P&L:</span>
                  <span className={`font-medium ml-2 ${position.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(position.unrealizedGainLoss)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Trade Type Selection */}
          <div className="flex space-x-2">
            <Button
              variant={tradeType === 'BUY' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setTradeType('BUY');
                setQuantity(1);
                clearError();
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button
              variant={tradeType === 'SELL' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setTradeType('SELL');
                setQuantity(1);
                clearError();
              }}
              disabled={!position || position.quantity === 0}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell
            </Button>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex space-x-2">
              <Input
                id="quantity"
                type="number"
                min="0"
                max={tradeType === 'BUY' ? maxAffordable : maxSellable}
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={handleMaxClick}
                disabled={tradeType === 'BUY' ? maxAffordable === 0 : maxSellable === 0}
              >
                Max
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {tradeType === 'BUY' ? (
                <>Max affordable: {maxAffordable} shares</>
              ) : (
                <>Available to sell: {maxSellable} shares</>
              )}
            </div>
          </div>

          {/* Trade Summary */}
          <div className="p-4 rounded-lg bg-muted/30 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Shares:</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Price per share:</span>
              <span className="font-medium">{formatCurrency(stock.price)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total {tradeType === 'BUY' ? 'Cost' : 'Revenue'}:</span>
              <span>{formatCurrency(totalCost)}</span>
            </div>
          </div>

          {/* Portfolio Info */}
          {portfolio && (
            <div className="p-4 rounded-lg border border-border/50 space-y-2">
              <h4 className="font-semibold text-sm">Portfolio Balance</h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Cash:</span>
                  <span className="font-medium ml-2">{formatCurrency(portfolio.cash)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-medium ml-2">{formatCurrency(portfolio.totalValue)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isConfirming}
            >
              Cancel
            </Button>
            <Button
              className={`flex-1 ${tradeType === 'SELL' ? 'bg-red-600 hover:bg-red-700' : ''}`}
              onClick={handleTrade}
              disabled={!canExecuteTrade() || isConfirming || loading}
            >
              {getTradeButtonText()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
