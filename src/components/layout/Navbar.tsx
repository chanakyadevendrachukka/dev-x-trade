
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Menu, 
  X,
  BarChart3,
  TrendingUp,
  Globe,
  Zap
} from 'lucide-react';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Markets', path: '/markets', icon: BarChart3 },
    { name: 'Trading', path: '/dashboard', icon: TrendingUp },
    { name: 'Analytics', path: '/analysis', icon: Globe },
    { name: 'Portfolio', path: '/portfolio', icon: Zap },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-6 w-6 text-black font-bold" />
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary to-success rounded-xl opacity-30"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                <span className="text-2xl font-bold text-foreground font-display tracking-tight">
                  DevX<span className="text-primary">Trade</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        className={`
                          relative px-6 py-3 rounded-xl text-base font-medium transition-all duration-300
                          ${isActive 
                            ? 'text-primary bg-primary/10 shadow-lg' 
                            : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                          }
                        `}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {item.name}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 rounded-xl border border-primary/30 bg-primary/5"
                            layoutId="activeNav"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}
            </div>

            {/* Search Bar */}
            <motion.div
              className="hidden md:flex items-center max-w-md flex-1 mx-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search markets, currencies..."
                  className="pl-12 pr-4 py-3 bg-card/30 backdrop-blur-sm border-border/50 rounded-xl focus:border-primary/50 focus:bg-card/50 transition-all duration-300 font-mono text-sm"
                />
              </div>
            </motion.div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                >
                  <Bell className="h-5 w-5" />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </Button>
              </motion.div>

              {/* Settings */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/settings">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              {/* Profile */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-xl bg-gradient-to-br from-primary/20 to-success/20 backdrop-blur-sm border border-primary/30 hover:from-primary/30 hover:to-success/30 transition-all duration-300"
                >
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </motion.div>

              {/* Mobile menu button */}
              <motion.div
                className="lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              className="fixed top-20 right-6 left-6 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl z-50 lg:hidden overflow-hidden"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="p-6 space-y-4">
                {/* Mobile Search */}
                <div className="relative md:hidden">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search markets..."
                    className="pl-12 pr-4 py-3 bg-background/50 border-border/50 rounded-xl font-mono text-sm"
                  />
                </div>
                
                {/* Navigation Items */}
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={`
                              w-full justify-start px-4 py-3 rounded-xl text-base font-medium transition-all duration-300
                              ${isActive 
                                ? 'text-primary bg-primary/10 border border-primary/20' 
                                : 'text-foreground hover:bg-background/50'
                              }
                            `}
                          >
                            <Icon className="h-5 w-5 mr-3" />
                            {item.name}
                          </Button>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
