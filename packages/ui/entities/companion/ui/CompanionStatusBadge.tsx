import { clsx } from 'clsx'
import type { CompanionStatus } from '../model/types'

type CompanionStatusBadgeProps = {
  status: CompanionStatus
  className?: string
}

const LABEL: Record<CompanionStatus, string> = {
  RECRUITING: '모집중',
  CLOSED: '마감',
}

export const CompanionStatusBadge = ({ status, className }: CompanionStatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2 py-0.5 text-l500-12',
      status === 'RECRUITING'
        ? 'bg-primary-50 text-primary-700'
        : 'bg-neutral-100 text-neutral-500',
      className,
    )}
  >
    {LABEL[status]}
  </span>
)
