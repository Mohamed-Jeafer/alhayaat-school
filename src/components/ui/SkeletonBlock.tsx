import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export interface SkeletonBlockProps {
  className?: string;
  height?: string;
  width?: string;
  count?: number;
  rounded?: boolean;
}

export default function SkeletonBlock({
  className,
  height = 'h-4',
  width = 'w-full',
  count = 1,
  rounded = false,
}: SkeletonBlockProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            height,
            width,
            rounded ? 'rounded-full' : 'rounded-md',
            i < count - 1 && 'mb-2',
            className,
          )}
        />
      ))}
    </>
  );
}
