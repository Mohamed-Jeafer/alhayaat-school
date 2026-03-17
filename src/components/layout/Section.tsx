import { cn } from '@/lib/utils';

export interface SectionProps {
  children: React.ReactNode;
  background?: 'white' | 'gray' | 'primary' | 'transparent';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  className?: string;
}

const backgroundMap: Record<NonNullable<SectionProps['background']>, string> = {
  white: 'bg-white',
  gray: 'bg-brand-off-white',
  primary: 'bg-brand-blue',
  transparent: 'bg-transparent',
};

const paddingMap: Record<NonNullable<SectionProps['padding']>, string> = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-20',
  none: 'py-0',
};

export function Section({
  children,
  background = 'white',
  padding = 'md',
  className,
}: SectionProps) {
  return (
    <section className={cn(backgroundMap[background], paddingMap[padding], className)}>
      {children}
    </section>
  );
}
