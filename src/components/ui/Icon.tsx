import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap: Record<NonNullable<IconProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({ icon: IconComponent, size = 'md', className }: IconProps) {
  const px = sizeMap[size];
  return (
    <IconComponent
      width={px}
      height={px}
      aria-hidden="true"
      className={cn('shrink-0', className)}
    />
  );
}
