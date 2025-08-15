import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface ModernStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function ModernStatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendLabel,
  variant = 'default',
  className,
  style,
  onClick,
}: ModernStatsCardProps) {
  const formattedTrend = trend !== undefined ? (trend > 0 ? `+${trend.toFixed(2)}%` : `${trend.toFixed(2)}%`) : null;
  const isTrendPositive = trend !== undefined ? trend > 0 : null;
  
  const variantStyles = {
    default: 'bg-gradient-to-br from-card/80 to-card/40',
    success: 'bg-gradient-to-br from-success/10 to-success/5 border-success/20',
    danger: 'bg-gradient-to-br from-danger/10 to-danger/5 border-danger/20',
    warning: 'bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20',
  };
  
  return (
    <div 
      className={cn(
        'premium-card p-6 rounded-2xl backdrop-blur-xl border border-white/10',
        'transition-all duration-700 ease-out hover:scale-105 hover:-translate-y-2',
        'hover:shadow-premium group cursor-pointer',
        variantStyles[variant],
        className
      )}
      style={style}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </h3>
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center 
                         group-hover:bg-primary/20 transition-colors duration-300">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
        )}
      </div>
      
      {/* Value */}
      <div className="mb-3">
        <div className="text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
          {value}
        </div>
      </div>
      
      {/* Trend & Description */}
      {(description || trend !== undefined) && (
        <div className="flex items-center justify-between text-sm">
          {trend !== undefined && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg font-medium",
              isTrendPositive 
                ? "bg-success/10 text-success" 
                : "bg-danger/10 text-danger"
            )}>
              {isTrendPositive ? 
                <ArrowUpIcon className="h-3 w-3" /> : 
                <ArrowDownIcon className="h-3 w-3" />
              }
              {formattedTrend}
            </div>
          )}
          
          {(description || trendLabel) && (
            <div className="text-muted-foreground text-xs text-right">
              {trendLabel || description}
            </div>
          )}
        </div>
      )}
      
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-primary-glow/5 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}