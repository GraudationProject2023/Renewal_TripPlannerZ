import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../cn'

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, ...props }, ref) => (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-lg border bg-neutral-0 px-3 py-2 text-l500-14 text-neutral-900 shadow-sm outline-none transition-colors',
        'placeholder:text-neutral-400',
        'focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-100',
        'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400',
        'resize-y',
        invalid
          ? 'border-error-500 focus-visible:border-error-600 focus-visible:ring-error-100'
          : 'border-neutral-300',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export type { TextareaProps }
