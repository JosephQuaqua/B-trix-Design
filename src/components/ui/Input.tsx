import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2)}`
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-charcoal-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-md border bg-ivory-50 px-4 py-2.5 text-charcoal-800 placeholder:text-charcoal-400',
            'border-ivory-300 transition-all duration-200',
            'focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200 focus:ring-offset-0',
            error && 'border-danger-500/50 focus:border-danger-500 focus:ring-danger-200',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-danger-700">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-sm text-charcoal-400">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Input.displayName = 'Input'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).slice(2)}`
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-charcoal-700 mb-1.5">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-md border bg-ivory-50 px-4 py-2.5 text-charcoal-800 placeholder:text-charcoal-400',
            'border-ivory-300 transition-all duration-200 min-h-[120px] resize-y',
            'focus:border-champagne-400 focus:ring-2 focus:ring-champagne-200 focus:ring-offset-0',
            error && 'border-danger-500/50 focus:border-danger-500 focus:ring-danger-200',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-danger-700">{error}</p>
        ) : hint ? (
          <p className="mt-1 text-sm text-charcoal-400">{hint}</p>
        ) : null}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'
