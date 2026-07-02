import { Badge } from '../../../shared/ui'
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

const VARIANT: Record<ApplicationStatus, 'neutral' | 'primary' | 'error'> = {
  PENDING: 'neutral',
  ACCEPTED: 'primary',
  REJECTED: 'error',
}

export const ApplicationStatusBadge = ({
  status,
  className,
}: ApplicationStatusBadgeProps) => (
  <Badge variant={VARIANT[status]} className={className}>
    {LABEL[status]}
  </Badge>
)
