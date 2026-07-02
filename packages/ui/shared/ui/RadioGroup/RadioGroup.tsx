'use client'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn'

export const RadioGroup = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn('flex gap-2', className)}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'bg-neutral-0 text-primary-600 focus-visible:ring-primary-400 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-neutral-300 focus-visible:ring-2 focus-visible:outline-none',
      'data-[state=checked]:border-primary-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2 w-2 fill-current" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'

type RadioCardProps = ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> & {
  label: string
  description?: string
}

/** 카드형 라디오 옵션. TripCreateDialog의 visibility 선택 같은 용도. */
export const RadioCard = forwardRef<HTMLButtonElement, RadioCardProps>(
  ({ label, description, className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'bg-neutral-0 text-l500-14 flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-left text-neutral-600 transition-colors',
        'hover:bg-neutral-50',
        'data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700',
        'focus-visible:ring-primary-400 focus-visible:ring-2 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <div className="text-center font-medium">{label}</div>
      {description && (
        <div className="text-l500-12 mt-0.5 text-center text-neutral-500">
          {description}
        </div>
      )}
    </RadioGroupPrimitive.Item>
  ),
)
RadioCard.displayName = 'RadioCard'
