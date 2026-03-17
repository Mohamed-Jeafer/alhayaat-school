'use client';

import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface AlertBannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const variantConfig = {
  info: {
    icon: Info,
    alertVariant: 'default' as const,
    iconClass: 'text-blue-500',
  },
  success: {
    icon: CheckCircle,
    alertVariant: 'default' as const,
    iconClass: 'text-green-600',
  },
  warning: {
    icon: AlertTriangle,
    alertVariant: 'default' as const,
    iconClass: 'text-yellow-500',
  },
  error: {
    icon: AlertCircle,
    alertVariant: 'destructive' as const,
    iconClass: '',
  },
};

export default function AlertBanner({
  variant = 'info',
  title,
  children,
  className,
}: AlertBannerProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const needsRole = variant === 'error' || variant === 'warning';

  return (
    <Alert
      variant={config.alertVariant}
      role={needsRole ? 'alert' : undefined}
      className={cn(className)}
    >
      <Icon className={cn('h-4 w-4', config.iconClass)} />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
