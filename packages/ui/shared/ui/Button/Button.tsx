import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../cn'

const buttonVariants = cva(
  'inline-flex select-none items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/60 focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50 disabled:shadow-none',
  {
    variants: {
      variant: {
        'solid-primary':
          'border border-transparent bg-primary-500 text-white shadow-primary hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-primary-lg active:bg-primary-700 active:shadow-primary',
        'outlined-primary':
          'border border-primary-200 bg-primary-50/50 text-primary-700 hover:border-primary-300 hover:bg-primary-100/70 active:bg-primary-100',
        'outlined-secondary':
          'border border-neutral-200 bg-neutral-0 text-neutral-700 shadow-50 hover:border-neutral-300 hover:bg-neutral-50 active:bg-neutral-100',
        'outlined-assistive':
          'border border-neutral-200 bg-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700',
        secondary:
          'border border-transparent bg-neutral-900 text-white shadow-50 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-100 active:bg-neutral-900',
        ghost:
          'border border-transparent bg-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 active:bg-neutral-200',
        link: 'border-none bg-transparent p-0 text-primary-600 underline-offset-4 hover:text-primary-700 hover:underline',
        destructive:
          'border border-transparent bg-error-600 text-white shadow-danger hover:-translate-y-0.5 hover:bg-error-700 hover:shadow-danger-lg active:bg-error-700 active:shadow-danger',
      },
      size: {
        xl: 'text-l500-18 gap-2.5 px-6 py-3.5',
        lg: 'text-l500-16 px-5 py-3',
        md: 'text-l500-14 px-4 py-2.5',
        sm: 'text-l500-12 px-3 py-2',
        icon: 'h-10 w-10 p-0',
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
    {
      className,
      variant,
      size,
      asChild = false,
      icon,
      children,
      type = 'button',
      ...props
    },
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
