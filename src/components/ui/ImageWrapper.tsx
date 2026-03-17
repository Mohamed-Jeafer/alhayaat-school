import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface ImageWrapperProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
}

export function ImageWrapper({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
}: ImageWrapperProps) {
  const safeAlt = alt.trim() !== '' ? alt : 'image';

  if (fill) {
    return (
      <Image
        src={src}
        alt={safeAlt}
        fill
        priority={priority}
        className={cn('object-cover', className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={safeAlt}
      width={width ?? 800}
      height={height ?? 600}
      priority={priority}
      className={cn(className)}
    />
  );
}
