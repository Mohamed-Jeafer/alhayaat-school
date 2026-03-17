import { TrendingDown, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataCardProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export default function DataCard({
  label,
  value,
  trend,
  trendValue,
  icon,
  className,
}: DataCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card p-5 shadow-sm flex flex-col gap-3',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight">{value}</span>

        {trend && trend !== 'neutral' && trendValue && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-sm font-medium',
              trend === 'up' ? 'text-green-600' : 'text-red-600',
            )}
          >
            {trend === 'up' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}
