import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, Activity, DollarSign, Clock } from 'lucide-react';
import { StatsCard } from '@/components/ui/StatsCard';
import { useStocks, mockStocks } from '@/utils/stocksApi';

export function TradingDashboardSection() {
  const { stocks, loading, error } = useStocks();
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  
  const topGainers = stocks
    .filter(s => s.changePercent > 0)
    .sort((a, b) => b.changePercent - a.changePercent)
    .slice(0, 5);
    
  const topLosers = stocks
    .filter(s => s.changePercent < 0)
    .sort((a, b) => a.changePercent - b.changePercent)
    .slice(0, 5);

  const timeframes = ['1h', '24h', '7d', '30d'];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
          >
            <Activity className="h-4 w-4" />
            AI-Powered Market Intelligence
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-display">
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Intelligent Trading
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-driven insights and automated trading strategies powered by machine learning algorithms 
            for superior market performance and risk management
          </p>
        </motion.div>

        {/* Market Overview Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          <motion.div variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="AI Predictions Made"
              value="2.1M"
              trend={15.2}
              icon={<BarChart3 />}
              className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Success Rate"
              value="94.7%"
              trend={2.8}
              icon={<Activity />}
              className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:border-success/40"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Active AI Strategies"
              value="1,250"
              trend={18.4}
              icon={<TrendingUp />}
              className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40"
            />
          </motion.div>
          <motion.div variants={{ hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
            <StatsCard
              title="Processing Speed"
              value="0.3ms"
              description="AI decision time"
              icon={<Clock />}
              className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:border-warning/40"
            />
          </motion.div>
        </motion.div>

        {/* Trading Interface Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Gainers */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-success/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-success" />
                AI Recommended Buys
              </h3>
              <div className="flex gap-2">
                {timeframes.map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      selectedTimeframe === tf 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted/20 text-muted-foreground hover:bg-muted/40'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {topGainers.map((stock, index) => (
                  <motion.div
                    key={`${stock.symbol}-${selectedTimeframe}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-success/5 border border-success/20 hover:border-success/40 transition-all duration-300"
                  >
                    <div>
                      <div className="font-bold text-lg font-mono">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                        {stock.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg font-mono">${stock.price.toFixed(2)}</div>
                      <div className="flex items-center text-success font-medium font-mono">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        +{stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Top Losers */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl rounded-2xl p-6 border border-border/50 hover:border-danger/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <TrendingDown className="h-6 w-6 text-danger" />
                AI Risk Alerts
              </h3>
            </div>
            
            <div className="space-y-4">
              {topLosers.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-danger/5 border border-danger/20 hover:border-danger/40 transition-all duration-300"
                >
                  <div>
                    <div className="font-bold text-lg font-mono">{stock.symbol}</div>
                    <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                      {stock.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg font-mono">${stock.price.toFixed(2)}</div>
                    <div className="flex items-center text-danger font-medium font-mono">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {stock.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Trading Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "AI STRATEGIES",
                subtitle: "Deploy intelligent bots with machine learning algorithms that adapt to market conditions",
                action: "Start trading"
              },
              {
                title: "PREDICTIVE ANALYTICS",
                subtitle: "Advanced AI models predict market movements with 94.7% accuracy rate",
                action: "View insights"
              },
              {
                title: "SMART PORTFOLIO",
                subtitle: "AI-powered portfolio optimization and automated rebalancing",
                action: "Optimize now"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-2xl bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300 group"
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-primary font-display">{feature.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">{feature.subtitle}</p>
                <button className="text-primary font-medium hover:text-primary-glow transition-colors duration-200 group-hover:underline font-mono">
                  {feature.action} →
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
