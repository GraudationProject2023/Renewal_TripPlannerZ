import { clsx } from 'clsx'
import type { TripVisibility } from '../model/types'

type TripVisibilityBadgeProps = {
  visibility: TripVisibility
  className?: string
}

const LABEL: Record<TripVisibility, string> = {
  PUBLIC: '공개',
  PRIVATE: '비공개',
}

export const TripVisibilityBadge = ({
  visibility,
  className,
}: TripVisibilityBadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-2 py-0.5 text-l500-12',
      visibility === 'PUBLIC'
        ? 'bg-primary-50 text-primary-700'
        : 'bg-neutral-100 text-neutral-600',
      className,
    )}
  >
    {LABEL[visibility]}
  </span>
)
