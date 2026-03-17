'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'

export interface FormFieldProps {
  label: string
  name: string
  required?: boolean
  error?: string
  helpText?: string
  children: React.ReactNode
}

export function FormField({
  label,
  name,
  required,
  error,
  helpText,
  children,
}: FormFieldProps) {
  const helpId = helpText ? `${name}-help` : undefined
  const errorId = error ? `${name}-error` : undefined
  const describedBy = [helpId, errorId].filter(Boolean).join(' ') || undefined

  // Inject aria attributes into the single child input element
  const child = React.Children.only(children) as React.ReactElement<
    Record<string, unknown>
  >
  const enhancedChild = React.cloneElement(child, {
    id: (child.props.id as string | undefined) ?? name,
    'aria-required': required ? 'true' : undefined,
    'aria-describedby':
      [child.props['aria-describedby'] as string | undefined, describedBy]
        .filter(Boolean)
        .join(' ') || undefined,
    'aria-invalid': error ? 'true' : undefined,
  })

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>
        {label}
        {required && (
          <span className="ml-0.5 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {enhancedChild}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {helpText && (
        <p id={helpId} className="text-sm text-muted-foreground">
          {helpText}
        </p>
      )}
    </div>
  )
}
