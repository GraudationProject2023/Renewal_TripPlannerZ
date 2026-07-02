'use client'
import * as LabelPrimitive from '@radix-ui/react-label'
import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import { cn } from '../cn'

type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        'text-l500-14 font-medium text-neutral-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  ),
)
Label.displayName = 'Label'

export type { LabelProps }
