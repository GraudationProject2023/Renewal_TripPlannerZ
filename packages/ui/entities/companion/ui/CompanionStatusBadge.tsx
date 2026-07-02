import { Badge } from '../../../shared/ui'
import type { CompanionStatus } from '../model/types'

type CompanionStatusBadgeProps = {
  status: CompanionStatus
  className?: string
}

export const CompanionStatusBadge = ({ status, className }: CompanionStatusBadgeProps) => (
  <Badge variant={status === 'RECRUITING' ? 'primary' : 'neutral'} className={className}>
    {status === 'RECRUITING' ? '모집중' : '마감'}
  </Badge>
)
