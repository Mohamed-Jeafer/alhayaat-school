'use client';

import { cn } from '@/lib/utils';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  className,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn('w-full', className)}
    >
      <Progress value={percentage}>
        {label && <ProgressLabel>{label}</ProgressLabel>}
        {showValue && <ProgressValue />}
      </Progress>
    </div>
  );
}
