
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { useStockData, mockStocks } from '@/utils/stocksApi';
import { StatsCard } from '@/components/ui/StatsCard';
import { Button } from '@/components/ui/button';
import { PieChart, Cell, Pie, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, Plus, Minus, RefreshCw, Wallet } from 'lucide-react';

const Portfolio = () => {
  const stocks = useStockData(mockStocks);
  const [selectedView, setSelectedView] = useState<'overview' | 'holdings' | 'performance'>('overview');
  
  // Mock portfolio data
  const portfolio = [
    { symbol: 'AAPL', shares: 15, costBasis: 150.75 },
    { symbol: 'MSFT', shares: 8, costBasis: 380.25 },
    { symbol: 'NVDA', shares: 5, costBasis: 820.50 },
    { symbol: 'GOOGL', shares: 10, costBasis: 145.30 },
    { symbol: 'TSLA', shares: 6, costBasis: 650.00 },
  ];
  
  // Calculate portfolio values
  const portfolioItems = portfolio.map(item => {
    const stock = stocks.find(s => s.symbol === item.symbol);
    if (!stock) return null;
    
    const currentValue = stock.price * item.shares;
    const costBasis = item.costBasis * item.shares;
    const gain = currentValue - costBasis;
    const gainPercent = (gain / costBasis) * 100;
    
    return {
      ...item,
      name: stock.name,
      currentPrice: stock.price,
      currentValue,
      costBasis,
      gain,
      gainPercent
    };
  }).filter(Boolean);
  
  const totalValue = portfolioItems.reduce((sum, item) => sum + item.currentValue, 0);
  const totalCost = portfolioItems.reduce((sum, item) => sum + item.costBasis, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = (totalGain / totalCost) * 100;
  
  // Mock historical data for performance chart
  const performanceData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    value: totalValue * (0.95 + Math.random() * 0.1) * (1 + (i * 0.005))
  }));
  
  // Data for pie chart
  const pieData = portfolioItems.map(item => ({
    name: item.symbol,
    value: item.currentValue,
    percentage: (item.currentValue / totalValue * 100).toFixed(1)
  }));
  
  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8884d8'];
  
  return (
    <PageLayout title="AI Portfolio Manager">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Portfolio Stats */}
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
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Total Value"
              value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={<Wallet />}
              className="bg-primary/5 border-primary/20"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Total Gain/Loss"
              value={`$${Math.abs(totalGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              trend={totalGainPercent}
              icon={totalGain >= 0 ? <TrendingUp /> : <TrendingDown />}
              className={totalGain >= 0 ? "bg-success/5 border-success/20" : "bg-danger/5 border-danger/20"}
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Holdings"
              value={portfolioItems.length}
              description="Active positions"
              icon={<PieChartIcon />}
              className="bg-blue-500/5 border-blue-500/20"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Day Change"
              value="$1,245.67"
              trend={2.34}
              icon={<BarChart3 />}
              className="bg-success/5 border-success/20"
            />
          </motion.div>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 p-1 bg-muted/20 rounded-lg w-fit"
        >
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'holdings', label: 'Holdings' },
            { key: 'performance', label: 'Performance' }
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={selectedView === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedView(tab.key as any)}
              className="relative"
            >
              {selectedView === tab.key && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </Button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Portfolio Allocation */}
              <motion.div
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-4 holographic-text">Portfolio Allocation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1000}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Performance */}
              <motion.div
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-lg font-semibold mb-4 holographic-text">30-Day Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedView === 'holdings' && (
            <motion.div
              key="holdings"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold holographic-text">Holdings Details</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="neon-button">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Position
                  </Button>
                  <Button size="sm" variant="outline" className="neon-button">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-3 px-4 font-medium">Symbol</th>
                      <th className="text-left py-3 px-4 font-medium">Name</th>
                      <th className="text-right py-3 px-4 font-medium">Shares</th>
                      <th className="text-right py-3 px-4 font-medium">Current Price</th>
                      <th className="text-right py-3 px-4 font-medium">Market Value</th>
                      <th className="text-right py-3 px-4 font-medium">Gain/Loss</th>
                      <th className="text-right py-3 px-4 font-medium">%</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolioItems.map((item, index) => (
                      <motion.tr
                        key={item.symbol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-medium text-primary">{item.symbol}</div>
                        </td>
                        <td className="py-4 px-4 max-w-[200px] truncate">{item.name}</td>
                        <td className="py-4 px-4 text-right">{item.shares}</td>
                        <td className="py-4 px-4 text-right">${item.currentPrice.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right font-medium">
                          ${item.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-medium ${item.gain >= 0 ? 'text-success' : 'text-danger'}`}>
                            ${Math.abs(item.gain).toFixed(2)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className={`font-medium ${item.gainPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                            {item.gainPercent >= 0 ? '+' : ''}{item.gainPercent.toFixed(2)}%
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {selectedView === 'performance' && (
            <motion.div
              key="performance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatsCard
                  title="Best Performer"
                  value={portfolioItems.reduce((best, item) => 
                    item.gainPercent > best.gainPercent ? item : best
                  ).symbol}
                  trend={portfolioItems.reduce((best, item) => 
                    item.gainPercent > best.gainPercent ? item : best
                  ).gainPercent}
                  className="bg-success/5 border-success/20"
                />
                <StatsCard
                  title="Worst Performer"
                  value={portfolioItems.reduce((worst, item) => 
                    item.gainPercent < worst.gainPercent ? item : worst
                  ).symbol}
                  trend={portfolioItems.reduce((worst, item) => 
                    item.gainPercent < worst.gainPercent ? item : worst
                  ).gainPercent}
                  className="bg-danger/5 border-danger/20"
                />
                <StatsCard
                  title="Largest Position"
                  value={portfolioItems.reduce((largest, item) => 
                    item.currentValue > largest.currentValue ? item : largest
                  ).symbol}
                  description={`${((portfolioItems.reduce((largest, item) => 
                    item.currentValue > largest.currentValue ? item : largest
                  ).currentValue / totalValue) * 100).toFixed(1)}% of portfolio`}
                  className="bg-blue-500/5 border-blue-500/20"
                />
              </div>
              
              <motion.div
                className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-xl p-6 border border-border/50"
                whileHover={{ scale: 1.01 }}
              >
                <h3 className="text-lg font-semibold mb-4 holographic-text">Historical Performance</h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(0, 0, 0, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={false}
                        animationDuration={2000}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
};

export default Portfolio;
