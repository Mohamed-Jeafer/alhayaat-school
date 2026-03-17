'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

export interface AvatarDisplayProps {
  src?: string;
  alt: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap: Record<NonNullable<AvatarDisplayProps['size']>, 'sm' | 'default' | 'lg'> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
};

export function AvatarDisplay({
  src,
  alt,
  initials,
  size = 'md',
}: AvatarDisplayProps) {
  const fallbackText = initials ?? alt.charAt(0).toUpperCase();
  const avatarSize = sizeMap[size];

  return (
    <Avatar size={avatarSize}>
      {src && <AvatarImage src={src} alt={alt} />}
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
