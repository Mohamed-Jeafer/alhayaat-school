import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  heading: string;
  body?: string;
  cta?: { label: string; href?: string; onClick?: () => void };
  icon?: React.ReactNode;
  className?: string;
}

export default function EmptyState({
  heading,
  body,
  cta,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 text-center',
        className,
      )}
    >
      <span className="text-muted-foreground">
        {icon ?? <Inbox className="h-12 w-12" />}
      </span>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold">{heading}</h3>
        {body && <p className="text-sm text-muted-foreground max-w-sm">{body}</p>}
      </div>

      {cta && (
        cta.href ? (
          <a
            href={cta.href}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {cta.label}
          </a>
        ) : (
          <Button variant="default" onClick={cta.onClick}>
            {cta.label}
          </Button>
        )
      )}
    </div>
  );
}
