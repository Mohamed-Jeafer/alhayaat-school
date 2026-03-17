'use client'

import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { VariantProps } from 'class-variance-authority'

export interface SubmitButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'sm',
  md: 'default',
  lg: 'lg',
} satisfies Record<NonNullable<SubmitButtonProps['size']>, VariantProps<typeof buttonVariants>['size']>

export function SubmitButton({
  children,
  isLoading = false,
  loadingText,
  disabled = false,
  className,
  size = 'md',
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      size={sizeMap[size]}
      disabled={isLoading || disabled}
      className={cn('relative', className)}
      aria-busy={isLoading}
    >
      {isLoading && (
        <Loader2
          className="mr-2 animate-spin"
          aria-hidden="true"
        />
      )}
      {isLoading ? (loadingText ?? children) : children}
    </Button>
  )
}
