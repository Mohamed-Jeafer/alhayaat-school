'use client';

import { cn } from '@/lib/utils';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  className?: string;
}

export function Divider({
  orientation = 'horizontal',
  label,
  className,
}: DividerProps) {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('inline-block h-full w-px bg-border', className)}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn('flex items-center gap-3', className)}
      >
        <span className="h-px flex-1 bg-border" />
        <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
        <span className="h-px flex-1 bg-border" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={cn('border-0 border-t border-border', className)}
    />
  );
}
