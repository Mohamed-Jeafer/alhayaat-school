'use client';

import React, { useRef, useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  target: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

export function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      const id = setTimeout(() => setCount(target), 0);
      return () => clearTimeout(id);
    }

    const startCounting = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const value = progress < 1 ? Math.round(target * easeOutQuad(progress)) : target;
        setCount(value);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounting();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return (
    <span ref={containerRef} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}
