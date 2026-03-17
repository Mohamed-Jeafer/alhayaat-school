'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface FileUploadProps {
  accept: string[]
  maxSizeBytes: number
  onChange: (file: File | null) => void
  error?: string
  label?: string
  id?: string
}

export function FileUpload({
  accept,
  maxSizeBytes,
  onChange,
  error,
  label = 'Upload file',
  id = 'file-upload',
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0)

  function validate(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    const accepted = accept.map((a) => a.toLowerCase())
    if (!accepted.includes(ext)) {
      return `Only ${accept.join(', ')} files are accepted`
    }
    if (file.size > maxSizeBytes) {
      return `File must be under ${maxSizeMB}MB`
    }
    return null
  }

  function handleFile(file: File | null) {
    if (!file) return
    const err = validate(file)
    if (err) {
      setValidationError(err)
      return
    }
    setValidationError(null)
    setSelectedFile(file)
    onChange(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0] ?? null)
    // Reset input so the same file can be re-selected after clearing
    e.target.value = ''
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragOver(false)
    handleFile(e.dataTransfer.files?.[0] ?? null)
  }

  function handleClear() {
    setSelectedFile(null)
    setValidationError(null)
    onChange(null)
  }

  const displayError = validationError ?? error

  return (
    <div className="flex flex-col gap-1.5">
      {/* Hidden file input — keyboard accessible via the drop zone label */}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept.join(',')}
        className="sr-only"
        onChange={handleInputChange}
        aria-label={label}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-sm transition-colors outline-none',
          'text-muted-foreground hover:border-ring hover:text-foreground',
          'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          isDragOver && 'border-ring bg-muted/50 text-foreground',
          displayError ? 'border-destructive' : 'border-input',
        )}
      >
        {selectedFile ? (
          <div className="flex items-center gap-3">
            <div className="text-center">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="rounded-md border border-input px-2 py-1 text-xs hover:bg-muted focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label="Remove selected file"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span>
              {isDragOver ? 'Drop file here' : 'Click or drag file here'}
            </span>
            <span className="text-xs">
              {accept.join(', ')} · max {maxSizeMB}MB
            </span>
          </>
        )}
      </div>

      {displayError && (
        <p role="alert" className="text-sm text-destructive">
          {displayError}
        </p>
      )}
    </div>
  )
}
