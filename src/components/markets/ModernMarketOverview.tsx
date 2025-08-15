import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, GlobeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MarketIndex, formatPercentage } from '@/utils/stocksApi';

interface ModernMarketOverviewProps {
  indices: MarketIndex[];
  className?: string;
}

export function ModernMarketOverview({ indices, className }: ModernMarketOverviewProps) {
  const groupedByRegion = indices.reduce<Record<string, MarketIndex[]>>((acc, index) => {
    if (!acc[index.region]) {
      acc[index.region] = [];
    }
    acc[index.region].push(index);
    return acc;
  }, {});
  
  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(groupedByRegion).map(([region, indices], regionIndex) => (
        <div 
          key={region} 
          className="animate-slide-up"
          style={{ animationDelay: `${regionIndex * 100}ms` }}
        >
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {region}
          </h4>
          <div className="space-y-3">
            {indices.map((index, indexIndex) => (
              <div 
                key={index.symbol}
                className="flex items-center justify-between p-3 rounded-lg 
                         bg-card/30 border border-white/5 backdrop-blur-sm
                         hover:bg-card/50 transition-all duration-300 group
                         animate-slide-up"
                style={{ animationDelay: `${regionIndex * 100 + indexIndex * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                    index.change >= 0 
                      ? 'bg-success/20 text-success' 
                      : 'bg-danger/20 text-danger'
                  )}>
                    {index.symbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-medium text-sm group-hover:text-primary transition-colors duration-300">
                      {index.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {index.symbol}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-sm">
                    {index.value.toLocaleString(undefined, { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className={cn(
                    'flex items-center justify-end gap-1 text-xs font-medium',
                    index.change >= 0 ? 'text-success' : 'text-danger'
                  )}>
                    {index.change >= 0 ? 
                      <ArrowUpIcon className="h-3 w-3" /> : 
                      <ArrowDownIcon className="h-3 w-3" />
                    }
                    {formatPercentage(index.changePercent)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}