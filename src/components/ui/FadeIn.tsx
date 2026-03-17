'use client';

import React, { useRef, useEffect } from 'react';

export interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  once?: boolean;
  className?: string;
}

export function FadeIn({
  children,
  duration = 600,
  delay = 0,
  once = true,
  className = '',
}: FadeInProps) {
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
            el.classList.add('opacity-100', 'translate-y-0');
            el.classList.remove('opacity-0', 'translate-y-4');
            if (once) observer.disconnect();
          } else if (!once) {
            el.classList.remove('opacity-100', 'translate-y-0');
            el.classList.add('opacity-0', 'translate-y-4');
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-4 transition-all ${className}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
}
