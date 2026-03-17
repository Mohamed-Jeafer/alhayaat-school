import { cn } from '@/lib/utils';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl';
}

const maxWidthMap: Record<NonNullable<ContainerProps['maxWidth']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '7xl': 'max-w-7xl',
};

export function Container({ children, className, maxWidth = '7xl' }: ContainerProps) {
  return (
    <div className={cn('mx-auto px-4 sm:px-6 lg:px-8', maxWidthMap[maxWidth], className)}>
      {children}
    </div>
  );
}
