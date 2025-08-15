
import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
  valueClassName?: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  className,
  valueClassName,
  onClick,
}: StatsCardProps) {
  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ 
        scale: 1.02, 
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative p-6 rounded-xl border border-border/50 backdrop-blur-xl overflow-hidden group",
        "bg-gradient-to-br from-card/80 to-card/40",
        "hover:shadow-card-hover transition-all duration-500",
        onClick ? "cursor-pointer" : "",
        className
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary-glow/5 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%",
              y: "100%",
              opacity: 0
            }}
            animate={{
              y: "-10%",
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
            {title}
          </h3>
          {icon && (
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="text-primary/70"
            >
              {icon}
            </motion.div>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className={cn(
            "text-2xl lg:text-3xl font-bold text-foreground mb-2 font-mono",
            valueClassName
          )}
        >
          {value}
        </motion.div>
        
        {trend !== undefined && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <motion.div
              animate={{ 
                rotate: isPositiveTrend ? [0, 10, 0] : [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : isNegativeTrend ? (
                <TrendingDown className="h-4 w-4 text-danger" />
              ) : null}
            </motion.div>
            <span className={cn(
              "text-sm font-medium font-mono",
              isPositiveTrend ? "text-success" : isNegativeTrend ? "text-danger" : "text-muted-foreground"
            )}>
              {trend > 0 ? '+' : ''}{trend.toFixed(2)}%
            </span>
            {trendLabel && (
              <span className="text-xs text-muted-foreground ml-1 font-mono">
                {trendLabel}
              </span>
            )}
          </motion.div>
        )}
        
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-xs text-muted-foreground mt-2 font-mono"
          >
            {description}
          </motion.p>
        )}
      </div>
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-primary-glow/10 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-xl border border-primary/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
