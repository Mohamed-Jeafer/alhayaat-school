import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export interface CTASectionProps {
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  variant?: 'primary' | 'secondary' | 'green';
  className?: string;
  id?: string;
}

export function CTASection({
  heading,
  body,
  primaryCta,
  secondaryCta,
  variant = 'green',
  className,
  id,
}: CTASectionProps) {
  const isPrimary = variant === 'primary';
  const isGreen = variant === 'green';

  return (
    <section
      id={id}
      className={cn(
        'relative w-full overflow-hidden px-6 py-20',
        isPrimary && 'bg-primary text-primary-foreground',
        isGreen && 'bg-brand-green text-white',
        !isPrimary && !isGreen && 'bg-background text-foreground',
        className,
      )}
    >
      {isGreen && (
        <Image
          src="/images/cta-bg.webp"
          alt=""
          fill
          className="object-cover object-center"
          aria-hidden="true"
          priority={false}
        />
      )}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center gap-10 px-6 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
        <h2 className="font-display text-[clamp(3rem,5vw,5rem)] font-normal leading-[0.85] lg:max-w-[25rem] lg:leading-[0.75]">
          {heading}
        </h2>
        <div className="flex flex-col items-center gap-6 lg:max-w-[41.6875rem] lg:items-start">
          <p
            className={cn(
              'text-[1.25rem] leading-[1.4] lg:text-[2rem] lg:leading-[1.3]',
              isPrimary ? 'text-primary-foreground/80' : 'text-white/80',
            )}
          >
            {body}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              variant={isPrimary ? 'secondary' : 'default'}
              render={<Link href={primaryCta.href} />}
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                size="lg"
                variant="outline"
                render={<Link href={secondaryCta.href} />}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
