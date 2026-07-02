import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../cn'

const alertVariants = cva('rounded-card border p-4', {
  variants: {
    variant: {
      info: 'border-primary-200 bg-primary-50 text-primary-700',
      success: 'border-success-200 bg-success-50 text-success-700',
      warning: 'border-warning-200 bg-warning-50 text-warning-700',
      error: 'border-error-200 bg-error-50 text-error-700',
      neutral: 'border-neutral-200 bg-neutral-50 text-neutral-700',
    },
  },
  defaultVariants: { variant: 'info' },
})

type AlertProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants> & {
    icon?: ReactNode
    title?: string
  }

export const Alert = ({
  className,
  variant,
  icon,
  title,
  children,
  ...props
}: AlertProps) => (
  <div
    role="alert"
    className={cn(alertVariants({ variant, className }))}
    {...props}
  >
    <div className="flex items-start gap-3">
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        {title && <p className="text-t600-16 font-semibold">{title}</p>}
        {children && (
          <div className={cn(title && 'mt-1', 'text-l500-14')}>{children}</div>
        )}
      </div>
    </div>
  </div>
)

export { alertVariants }
export type { AlertProps }
