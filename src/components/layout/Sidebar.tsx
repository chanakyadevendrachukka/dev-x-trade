
import React from 'react';
import { 
  BarChart, PieChart, BarChart3, Wallet, LineChart, Globe, 
  DollarSign, Settings, ChevronRight, ChevronLeft, Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  className?: string;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

export function Sidebar({ isCollapsed, onToggle, className }: SidebarProps) {
  const location = useLocation();
  
  const navItems = [
    {
      title: 'Home',
      icon: Home,
      href: '/',
    },
    {
      title: 'Dashboard',
      icon: BarChart,
      href: '/dashboard',
    },
    {
      title: 'Stocks',
      icon: BarChart3,
      href: '/stocks',
    },
    {
      title: 'Markets',
      icon: BarChart3,
      href: '/markets',
    },
    {
      title: 'Currencies',
      icon: DollarSign,
      href: '/currencies',
    },
    {
      title: 'Global',
      icon: Globe,
      href: '/global',
    },
    {
      title: 'Portfolio',
      icon: Wallet,
      href: '/portfolio',
    },
    {
      title: 'Performance',
      icon: LineChart,
      href: '/performance',
    },
    {
      title: 'Analysis',
      icon: PieChart,
      href: '/analysis',
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
    }
  ];

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
        duration: 0.4
      }
    },
    collapsed: {
      width: 64,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 200,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: "easeIn" as const
      }
    }
  };

  return (
    <motion.aside 
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className={cn(
        "bg-sidebar text-sidebar-foreground relative flex flex-col border-r border-sidebar-border glass-dark backdrop-blur-xl",
        className
      )}
    >
      {/* Header with animated logo */}
      <div className="flex h-16 items-center justify-center border-b border-sidebar-border relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary-glow/10"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.h2 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="font-bold tracking-tight text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent"
            >
              DevXTrade
            </motion.h2>
          )}
        </AnimatePresence>
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "absolute right-2 text-sidebar-foreground h-8 w-8 hover:bg-sidebar-accent hover:glow-effect",
              isCollapsed ? "right-2" : "right-4"
            )}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </motion.div>
          </Button>
        </motion.div>
      </div>
      
      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-300 group relative overflow-hidden",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-lg",
                    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-lg" : "text-sidebar-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                >
                  {/* Animated background for active state */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-lg opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="relative z-10"
                  >
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors duration-300",
                      isActive && "text-primary"
                    )} />
                  </motion.div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span 
                        variants={itemVariants}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        className="text-sm font-medium relative z-10"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute right-2 h-2 w-2 bg-primary rounded-full"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </ScrollArea>
      
      {/* Bottom status panel with animations */}
      <motion.div 
        className="p-4 border-t border-sidebar-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg bg-gradient-to-br from-sidebar-accent/50 to-sidebar-accent/30 p-3 text-xs text-sidebar-accent-foreground backdrop-blur-sm border border-sidebar-accent/20"
            >
              <div className="flex items-center gap-2 mb-1">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    backgroundColor: ["#10b981", "#059669", "#10b981"]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="h-2 w-2 bg-success rounded-full"
                />
                <p className="font-medium">Market Status</p>
              </div>
              <p className="text-success font-medium">Markets are open</p>
              <motion.p 
                className="text-[10px] opacity-75"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Closes in 3h 45m
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.aside>
  );
}
