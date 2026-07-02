import type { ReactNode } from 'react'
import { cn } from '../cn'

type FormFieldProps = {
  htmlFor?: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  className?: string
  children: ReactNode
}

/**
 * label + control + error/hint를 묶는 표준 필드 컨테이너.
 * 페이지·다이얼로그 폼에서 반복되는 마크업을 없앤다.
 */
export const FormField = ({
  htmlFor,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label
      htmlFor={htmlFor}
      className="text-l500-14 font-medium text-neutral-700"
    >
      {label}
      {required && <span className="text-error-500 ml-0.5">*</span>}
    </label>
    {children}
    {error ? (
      <p className="text-l500-12 text-error-600">{error}</p>
    ) : hint ? (
      <p className="text-l500-12 text-neutral-500">{hint}</p>
    ) : null}
  </div>
)
