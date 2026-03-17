'use client'

import * as React from 'react'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Radio } from '@base-ui/react/radio'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

export interface RadioGroupFieldProps {
  name: string
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroupField({
  name,
  options,
  value,
  onChange,
  orientation = 'vertical',
}: RadioGroupFieldProps) {
  return (
    <RadioGroup
      name={name}
      value={value}
      onValueChange={(val) => onChange?.(val)}
      aria-label={name}
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
      )}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2">
          <Radio.Root
            id={`${name}-${option.value}`}
            value={option.value}
            disabled={option.disabled}
            className={cn(
              'peer relative flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-transparent transition-colors outline-none',
              'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
              'disabled:pointer-events-none disabled:opacity-50',
              'data-checked:border-primary dark:bg-input/30'
            )}
          >
            <Radio.Indicator className="size-2 rounded-full bg-primary opacity-0 transition-opacity data-checked:opacity-100" />
          </Radio.Root>
          <Label
            htmlFor={`${name}-${option.value}`}
            className={option.disabled ? 'cursor-not-allowed opacity-50' : ''}
          >
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
