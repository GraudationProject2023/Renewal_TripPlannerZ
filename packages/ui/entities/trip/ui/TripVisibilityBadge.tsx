import { Badge } from '../../../shared/ui'
import type { TripVisibility } from '../model/types'

type TripVisibilityBadgeProps = {
  visibility: TripVisibility
  className?: string
}

export const TripVisibilityBadge = ({
  visibility,
  className,
}: TripVisibilityBadgeProps) => (
  <Badge variant={visibility === 'PUBLIC' ? 'primary' : 'neutral'} className={className}>
    {visibility === 'PUBLIC' ? '공개' : '비공개'}
  </Badge>
)
