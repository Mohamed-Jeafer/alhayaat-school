import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

const accentClassMap = {
  yellow: 'bg-brand-yellow',
  orange: 'bg-brand-orange',
  blue: 'bg-brand-blue',
  green: 'bg-brand-green',
  red: 'bg-red-500',
} as const;

export type ColoredBorderAccent = keyof typeof accentClassMap;

export interface ColoredBorderCardProps {
  accent?: ColoredBorderAccent;
  accentStyle?: 'border' | 'bar';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ColoredBorderCard({
  accent = 'yellow',
  accentStyle = 'border',
  icon,
  children,
  className,
  contentClassName,
}: ColoredBorderCardProps) {
  const accentHeight = accentStyle === 'bar' ? 'h-3' : 'h-2.5';

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-[1.25rem] border border-[#d9d9d9] bg-[#fcfcfc] p-7 shadow-sm',
        className,
      )}
    >
      <div className={cn('relative z-10 flex flex-col gap-4', contentClassName)}>
        {icon ? <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">{icon}</div> : null}
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn('absolute inset-x-0 bottom-0', accentHeight, accentClassMap[accent])}
      />
    </article>
  );
}
