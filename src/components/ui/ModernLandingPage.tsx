import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/ui/HeroSection';
import { TradingDashboardSection } from '@/components/ui/TradingDashboardSection';
import { Button } from '@/components/ui/button';
import { Mail, Twitter, Github, Linkedin } from 'lucide-react';

export function ModernLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Main content with proper top spacing for fixed navbar */}
      <main className="pt-20">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Trading Dashboard Section */}
        <TradingDashboardSection />
        
        {/* About Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-bold mb-6 font-display">
                <span className="text-foreground">AI-Powered</span>
                <br />
                <span className="bg-gradient-to-r from-primary via-primary-glow to-success bg-clip-text text-transparent">
                  Trading Suite
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Experience the future of trading with our comprehensive AI platform. From predictive analytics 
                to automated risk management, our intelligent algorithms help you make smarter trading decisions 
                and maximize your portfolio performance.
              </p>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-lg px-8 py-6 rounded-xl neon-button"
              >
                Start Now
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  title: "Machine Learning Models",
                  description: "Advanced neural networks trained on years of market data to identify profitable patterns"
                },
                {
                  title: "Real-Time Analytics",
                  description: "AI-powered sentiment analysis and technical indicators updated every millisecond"
                },
                {
                  title: "Automated Strategies",
                  description: "Self-optimizing trading bots that adapt to changing market conditions automatically"
                }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  className="p-8 rounded-2xl bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl border border-border/50 hover:border-primary/30 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <h3 className="text-2xl font-bold mb-4 text-primary font-display">{tech.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{tech.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 px-6 bg-gradient-to-r from-card/20 to-card/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 font-display">Subscribe Newsletter</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Stay updated with the latest market insights and trading opportunities
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-card/50 border border-border/50 focus:border-primary/50 focus:outline-none text-foreground font-mono"
                />
                <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary rounded-xl px-8">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border/50 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4 font-display">
                  DevXTrade
                </h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  Create, distribute and monetize your crypto all for free. 
                  Advanced trading platform for the modern trader.
                </p>
              </motion.div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 font-display">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Trading</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Portfolio</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 font-display">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-4 md:mb-0 font-mono">
              © 2025 DevXTrade. All rights reserved.
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: <Twitter className="h-5 w-5" />, href: "#" },
                { icon: <Github className="h-5 w-5" />, href: "#" },
                { icon: <Linkedin className="h-5 w-5" />, href: "#" },
                { icon: <Mail className="h-5 w-5" />, href: "#" }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  className="p-2 rounded-lg bg-card/50 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
