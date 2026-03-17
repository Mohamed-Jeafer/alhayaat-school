'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface AccordionItem {
  id: string;
  trigger: string;
  content: React.ReactNode;
}

export interface AccordionListProps {
  items: AccordionItem[];
  type?: 'single' | 'multiple';
  defaultValue?: string;
  className?: string;
}

export function AccordionList({
  items,
  type = 'single',
  defaultValue,
  className,
}: AccordionListProps) {
  return (
    <Accordion
      multiple={type === 'multiple'}
      defaultValue={defaultValue ? [defaultValue] : undefined}
      className={cn('w-full', className)}
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
