import { cva, type VariantProps } from 'class-variance-authority'
import type { HTMLAttributes } from 'react'
import { cn } from '../cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-l500-12 font-medium',
  {
    variants: {
      variant: {
        neutral: 'bg-neutral-100 text-neutral-600',
        primary: 'bg-primary-50 text-primary-700',
        success: 'bg-success-50 text-success-700',
        warning: 'bg-warning-50 text-warning-700',
        error: 'bg-error-50 text-error-700',
        outlined:
          'border border-neutral-200 bg-transparent text-neutral-600',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
)

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => (
  <span className={cn(badgeVariants({ variant, className }))} {...props} />
)

export { badgeVariants }
export type { BadgeProps }
