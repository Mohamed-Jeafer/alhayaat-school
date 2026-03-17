import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AutoScrollCarouselImage {
  id: string;
  src: string;
  alt: string;
}

export interface AutoScrollCarouselProps {
  images: AutoScrollCarouselImage[];
  className?: string;
}

export function AutoScrollCarousel({ images, className }: AutoScrollCarouselProps) {
  const loopImages = [...images, ...images];

  return (
    <div className={cn('group relative overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/80 to-transparent" />
      <div className="flex min-w-max animate-[webflow-marquee_28s_linear_infinite] gap-[1.6875rem] group-hover:[animation-play-state:paused]">
        {loopImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="relative h-[339px] w-[444px] shrink-0 overflow-hidden rounded-lg bg-brand-off-white"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 991px) 90vw, 444px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
