'use client';

import React, { useRef, useEffect } from 'react';

export interface SlideInProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

const initialTransform: Record<NonNullable<SlideInProps['direction']>, string> = {
  up: 'translateY(32px)',
  down: 'translateY(-32px)',
  left: 'translateX(32px)',
  right: 'translateX(-32px)',
};

export function SlideIn({
  children,
  direction = 'up',
  duration = 600,
  delay = 0,
  once = true,
  className = '',
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.style.transitionDelay = `${delay}ms`;
            el.style.opacity = '1';
            el.style.transform = 'none';
            if (once) observer.disconnect();
          } else if (!once) {
            el.style.transitionDelay = '0ms';
            el.style.opacity = '0';
            el.style.transform = initialTransform[direction];
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [direction, delay, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: 0,
        transform: initialTransform[direction],
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
      }}
    >
      {children}
    </div>
  );
}
