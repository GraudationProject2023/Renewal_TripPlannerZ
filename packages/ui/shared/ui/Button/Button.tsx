import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        'solid-primary':
          'border border-transparent bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        'outlined-primary':
          'border border-primary-600 bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100',
        'outlined-secondary':
          'border border-neutral-300 bg-transparent text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
        'outlined-assistive':
          'border border-neutral-200 bg-transparent text-neutral-500 hover:bg-neutral-100',
        secondary:
          'border border-transparent bg-neutral-800 text-white hover:bg-neutral-900',
        ghost:
          'border border-transparent bg-transparent text-neutral-700 hover:bg-neutral-100',
        link: 'border-none bg-transparent p-0 text-primary-600 underline-offset-4 hover:underline',
        destructive:
          'border border-transparent bg-error-600 text-white hover:bg-error-700',
      },
      size: {
        xl: 'text-l500-18 px-6 py-3',
        lg: 'text-l500-16 px-5 py-2.5',
        md: 'text-l500-14 px-4 py-2',
        sm: 'text-l500-12 px-3 py-1.5',
        icon: 'h-9 w-9 p-0',
      },
    },
    compoundVariants: [
      { variant: 'link', size: 'xl', className: 'p-0 text-l500-18' },
      { variant: 'link', size: 'lg', className: 'p-0 text-l500-16' },
      { variant: 'link', size: 'md', className: 'p-0 text-l500-14' },
      { variant: 'link', size: 'sm', className: 'p-0 text-l500-12' },
    ],
    defaultVariants: {
      variant: 'solid-primary',
      size: 'md',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** true면 자식을 그대로 렌더링 (Radix Slot). <Button asChild><a>..</a></Button> 패턴. */
    asChild?: boolean
    icon?: ReactNode
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, icon, children, type = 'button', ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
        {children}
      </Comp>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
export type { ButtonProps }
