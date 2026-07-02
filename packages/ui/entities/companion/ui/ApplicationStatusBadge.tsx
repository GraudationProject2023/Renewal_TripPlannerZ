import { clsx } from 'clsx'
import type { ApplicationStatus } from '../model/types'

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
  className?: string
}

const LABEL: Record<ApplicationStatus, string> = {
  PENDING: '대기 중',
  ACCEPTED: '수락됨',
  REJECTED: '거절됨',
}

const STYLE: Record<ApplicationStatus, string> = {
  PENDING: 'bg-neutral-100 text-neutral-600',
  ACCEPTED: 'bg-primary-50 text-primary-700',
  REJECTED: 'bg-error-50 text-error-700',
}

export const ApplicationStatusBadge = ({
  status,
  className,
}: ApplicationStatusBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2 py-0.5 text-l500-12',
      STYLE[status],
      className,
    )}
  >
    {LABEL[status]}
  </span>
)
