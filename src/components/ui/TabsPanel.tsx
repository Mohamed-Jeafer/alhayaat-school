'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsPanelProps {
  tabs: TabItem[];
  defaultTab?: string;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'webflow';
}

export function TabsPanel({
  tabs,
  defaultTab,
  className,
  listClassName,
  contentClassName,
  orientation = 'horizontal',
  variant = 'default',
}: TabsPanelProps) {
  const initialTab = defaultTab ?? tabs[0]?.id;
  const webflowVariant = variant === 'webflow';

  return (
    <Tabs defaultValue={initialTab} className={cn('w-full', className)} orientation={orientation}>
      <TabsList
        variant={webflowVariant ? 'line' : 'default'}
        className={cn(
          webflowVariant &&
            'w-full shrink-0 gap-3 rounded-none bg-transparent p-0 md:w-[18rem] md:items-stretch',
          listClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              webflowVariant &&
                "min-h-[4.25rem] justify-start rounded-2xl border border-black/5 bg-transparent px-6 py-4 text-left text-lg font-medium text-brand-black/50 shadow-none transition-all duration-300 data-active:bg-brand-off-white-background data-active:text-brand-black data-active:opacity-100 md:after:hidden md:data-active:bg-[url('/images/Polygon-46.svg')] md:data-active:bg-[length:1.25rem_3.75rem] md:data-active:bg-[center_right_1.25rem] md:data-active:bg-no-repeat",
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className={cn(
            webflowVariant &&
              'rounded-[1.25rem] border border-black/10 bg-white p-8 text-base leading-relaxed text-brand-black/80 shadow-sm',
            contentClassName,
          )}
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
