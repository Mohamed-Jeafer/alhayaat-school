import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'default' | 'highlighted';
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  variant = 'default',
  className,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        'transition-shadow duration-200 hover:shadow-lg',
        variant === 'highlighted'
          ? 'bg-primary text-primary-foreground ring-primary'
          : 'bg-card text-card-foreground',
        className,
      )}
    >
      <CardContent className="flex flex-col gap-4 p-6">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-lg',
            variant === 'highlighted'
              ? 'bg-primary-foreground/10'
              : 'bg-muted',
          )}
        >
          {icon}
        </div>
        <h3
          className={cn(
            'text-lg font-semibold leading-snug',
            variant === 'highlighted'
              ? 'text-primary-foreground'
              : 'text-foreground',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm leading-relaxed',
            variant === 'highlighted'
              ? 'text-primary-foreground/80'
              : 'text-muted-foreground',
          )}
        >
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
