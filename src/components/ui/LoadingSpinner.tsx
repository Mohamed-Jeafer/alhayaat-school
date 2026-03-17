import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
};

export default function LoadingSpinner({
  size = 'md',
  label = 'Loading…',
  className,
}: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      className={cn('inline-flex items-center justify-center', className)}
    >
      <Loader2 className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
