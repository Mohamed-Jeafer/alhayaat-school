"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  placeholder?: string
  rows?: number
  disabled?: boolean
  error?: boolean
  className?: string
}

const TextareaField = React.forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ className, error, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        rows={rows}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 resize-y md:text-sm dark:bg-input/30 dark:disabled:bg-input/80",
          error &&
            "border-destructive ring-3 ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
          className
        )}
        {...props}
      />
    )
  }
)
TextareaField.displayName = "TextareaField"

export { Textarea, TextareaField }
