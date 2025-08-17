
import React, { useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Clock,
  Wallet,
  Activity,
  Plus,
  Minus
} from 'lucide-react';
import { useRealTrading as useTrading } from '@/hooks/useRealTrading';
import { useStocks, mockStocks } from '@/utils/stocksApi';
import { formatCurrency, formatPercentage, formatDate } from '@/utils/stocksApi';
import { TradingDialog } from '@/components/trading/TradingDialog';

export default function Portfolio() {
  const { 
    user, 
    portfolio, 
    userProfile, 
    trades, 
    loading, 
    error,
    updatePortfolioWithCurrentPrices 
  } = useTrading();
  
  const { stocks } = useStocks();

  // Update portfolio with current market prices
  useEffect(() => {
    if (portfolio && stocks.length > 0) {
      updatePortfolioWithCurrentPrices(stocks);
    }
  }, [stocks, portfolio]);

  if (!user) {
    return (
      <PageLayout title="Portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Portfolio Access Required</h2>
            <p className="text-muted-foreground mb-6">Sign in to view your portfolio and start trading</p>
            <Button>Sign In to Continue</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (loading && !portfolio) {
    return (
      <PageLayout title="Portfolio">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Portfolio</h1>
            <p className="text-muted-foreground">
              Track your investments and trading performance
            </p>
          </div>
          {userProfile && (
            <Badge variant="secondary" className="text-sm">
              <Activity className="h-4 w-4 mr-2" />
              {userProfile.totalTrades} Total Trades
            </Badge>
          )}
        </div>

        {/* Portfolio Overview */}
        {portfolio && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-muted-foreground">Portfolio Value</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</div>
                  <div className={`flex items-center text-sm ${portfolio.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {portfolio.totalGainLoss >= 0 ? 
                      <TrendingUp className="h-3 w-3 mr-1" /> : 
                      <TrendingDown className="h-3 w-3 mr-1" />
                    }
                    {formatCurrency(portfolio.totalGainLoss)} ({formatPercentage(portfolio.totalGainLossPercent)})
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-muted-foreground">Available Cash</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{formatCurrency(portfolio.cash)}</div>
                  <div className="text-sm text-muted-foreground">
                    {((portfolio.cash / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-muted-foreground">Total Invested</span>
                </div>
                <div className="mt-2">
                  <div className="text-2xl font-bold">{formatCurrency(portfolio.totalInvested)}</div>
                  <div className="text-sm text-muted-foreground">
                    {portfolio.positions.length} position{portfolio.positions.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg font-semibold">{formatDate(portfolio.lastUpdated)}</div>
                  <div className="text-sm text-muted-foreground">Market data</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="positions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Positions Tab */}
          <TabsContent value="positions" className="space-y-6">
            {portfolio && portfolio.positions.length > 0 ? (
              <div className="grid gap-6">
                {portfolio.positions.map((position) => {
                  const currentStock = stocks.find(s => s.symbol === position.symbol);
                  return (
                    <Card key={position.symbol}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold">{position.symbol}</h3>
                              <Badge variant="outline">{position.quantity} shares</Badge>
                            </div>
                            <p className="text-muted-foreground">{position.stockName}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Avg Cost:</span>
                                <div className="font-medium">{formatCurrency(position.averagePrice)}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Current:</span>
                                <div className="font-medium">{formatCurrency(position.currentPrice)}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Value:</span>
                                <div className="font-medium">{formatCurrency(position.currentValue)}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">P&L:</span>
                                <div className={`font-medium ${position.unrealizedGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(position.unrealizedGainLoss)}
                                  <span className="text-xs ml-1">({formatPercentage(position.unrealizedGainLossPercent)})</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {currentStock && (
                            <div className="flex gap-2">
                              <TradingDialog stock={currentStock}>
                                <Button size="sm">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  Trade
                                </Button>
                              </TradingDialog>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <PieChart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Positions Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start trading to see your positions here
                  </p>
                  <Button>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Explore Stocks
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Trade History Tab */}
          <TabsContent value="history" className="space-y-6">
            {trades.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trades.slice(0, 20).map((trade) => (
                      <div key={trade.id} className="flex items-center justify-between p-4 rounded-lg border">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${trade.type === 'BUY' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {trade.type === 'BUY' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{trade.symbol}</span>
                              <Badge variant={trade.type === 'BUY' ? 'default' : 'destructive'} className="text-xs">
                                {trade.type}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {trade.quantity} shares @ {formatCurrency(trade.price)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(trade.totalAmount)}</div>
                          <div className="text-sm text-muted-foreground">{formatDate(trade.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Activity className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Trade History</h3>
                  <p className="text-muted-foreground">
                    Your completed trades will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 mx-auto mb-2" />
                      <p>Portfolio allocation chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                      <p>Performance chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
