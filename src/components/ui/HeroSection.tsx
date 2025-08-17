import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Shield, Zap, Globe, BarChart3, Activity } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background/95 to-card/20">
      {/* Complex animated background */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-transparent to-primary/5" />
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-success/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:72px_72px]" />
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-20 w-4 h-4 bg-primary/40 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-2 h-2 bg-success/60 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Main Content */}
        <div className="text-center">
          {/* Small badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
          >
            <Activity className="h-4 w-4" />
            AI-Powered Trading Platform
          </motion.div>

          {/* Main headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-tight mb-4">
              <span className="block text-foreground font-display">Smart</span>
              <span className="block text-foreground font-display">Trading,</span>
              <motion.span 
                className="block bg-gradient-to-r from-primary via-primary to-success bg-clip-text text-transparent font-display"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Simplified
              </motion.span>
            </h1>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harness the power of artificial intelligence for{" "}
            <span className="text-primary font-medium">smarter trading decisions</span>{" "}
            and automated portfolio optimization
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/dashboard">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-black font-semibold text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300 border-0"
              >
                Start Trading
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/stocks">
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-12 py-6 rounded-full border-2 border-border hover:border-primary/50 bg-transparent backdrop-blur-sm text-foreground hover:bg-primary/5 font-semibold"
              >
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Statistics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {[
              {
                number: "$2.1T+",
                label: "AI-Analyzed Volume",
                description: "24h volume processed by our AI systems"
              },
              {
                number: "97.8%",
                label: "Prediction Accuracy",
                description: "AI market prediction success rate"
              },
              {
                number: "12ms",
                label: "Decision Speed",
                description: "AI-driven trade execution time"
              }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-mono">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {[
            {
              icon: <BarChart3 className="h-8 w-8" />,
              title: "Predictive AI Analytics",
              description: "Advanced machine learning models analyze market patterns and predict optimal entry/exit points"
            },
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Smart Risk Management",
              description: "AI-powered risk assessment automatically adjusts position sizes and stop-losses in real-time"
            },
            {
              icon: <Zap className="h-8 w-8" />,
              title: "Automated Trading Bots",
              description: "Deploy intelligent trading algorithms that learn from market conditions and adapt strategies"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group p-8 rounded-2xl bg-card/30 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:bg-card/50"
              whileHover={{ 
                scale: 1.02, 
                y: -8,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <div className="text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-primary rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
