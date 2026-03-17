import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface WhyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  className?: string;
}

export function WhyCard({
  icon,
  title,
  description,
  index,
  className,
}: WhyCardProps) {
  return (
    <Card
      className={cn(
        'transition-shadow duration-200 hover:shadow-lg',
        className,
      )}
    >
      <CardContent className="flex flex-col gap-5 p-8">
        <div className="flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
            {icon}
          </div>
          <Badge variant="secondary" className="text-sm font-bold tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold leading-snug text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
