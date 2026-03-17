'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface TooltipWrapperProps {
  children: React.ReactNode;
  content: string | React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function TooltipWrapper({
  children,
  content,
  side = 'top',
}: TooltipWrapperProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
