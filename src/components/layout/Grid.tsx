import { cn } from '@/lib/utils';

export interface GridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const columnsMap: Record<NonNullable<GridProps['columns']>, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

const gapMap: Record<NonNullable<GridProps['gap']>, string> = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
};

export function Grid({ children, columns = 2, gap = 'md', className }: GridProps) {
  return (
    <div className={cn('grid grid-cols-1', columnsMap[columns], gapMap[gap], className)}>
      {children}
    </div>
  );
}
