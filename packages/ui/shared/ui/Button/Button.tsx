import { clsx } from 'clsx'

type ButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement>
  onMouseLeave?: React.MouseEventHandler<HTMLButtonElement>
  variant?:
    | 'solid-primary'
    | 'outlined-primary'
    | 'outlined-secondary'
    | 'outlined-assistive'
    | 'secondary'
    | 'link'
    | 'custom'
  size?: 'xl' | 'lg' | 'md' | 'sm'
  disabled?: boolean
  icon?: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset' 
}

export const Button = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  variant = 'solid-primary',
  size = 'md',
  disabled,
  icon,
  className,
  type = 'button', 
}: ButtonProps) => {
  return (
    <button
      type={type} 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      className={clsx(
        'font-medium transition-all duration-150',
        variant !== 'custom' && {
          'bg-primary-600 hover:bg-primary-700 border border-transparent text-white':
            variant === 'solid-primary',
          'border-primary-600 text-primary-600 hover:bg-primary-50 border':
            variant === 'outlined-primary',
          'border border-neutral-400 text-neutral-600 hover:bg-neutral-100':
            variant === 'outlined-secondary',
          'border border-neutral-300 text-neutral-500 hover:bg-neutral-100':
            variant === 'outlined-assistive',
          'border border-transparent bg-neutral-600 text-white hover:bg-neutral-700':
            variant === 'secondary',
          'p-1': variant === 'link',
        },
        variant !== 'custom' && {
          'text-l500-18 px-6 py-3': size === 'xl' && variant !== 'link',
          'text-l500-16 px-5 py-2.5': size === 'lg' && variant !== 'link',
          'text-l500-14 px-4 py-2': size === 'md' && variant !== 'link',
          'text-l500-12 px-3 py-1.5': size === 'sm' && variant !== 'link',
        },
        {
          'cursor-not-allowed opacity-50': disabled,
        },
        'flex items-center justify-center gap-1',
        className,
      )}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  )
}
