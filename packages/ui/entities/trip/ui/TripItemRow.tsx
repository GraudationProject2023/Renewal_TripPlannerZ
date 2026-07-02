import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import { formatBudget, formatStay } from '../lib/format'
import type { TripItem } from '../model/types'

type TripItemRowProps = {
  item: TripItem
  index: number
  isDragging?: boolean
  actions?: ReactNode
  className?: string
}

export const TripItemRow = ({
  item,
  index,
  isDragging,
  actions,
  className,
}: TripItemRowProps) => (
  <div
    className={clsx(
      'flex items-start gap-3 rounded-card border bg-neutral-0 p-4 transition-all',
      isDragging
        ? 'border-primary-400 opacity-60 shadow-100'
        : 'border-neutral-200 shadow-50 hover:border-neutral-300',
      className,
    )}
  >
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-l500-14 font-semibold text-primary-700">
      {index + 1}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-t600-16 font-semibold text-neutral-900">
        {item.placeName}
      </p>
      {item.memo && (
        <p className="mt-1 line-clamp-2 text-l500-14 text-neutral-600">{item.memo}</p>
      )}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-l500-12 text-neutral-500">
        {item.stayMinutes ? <span>⏱ {formatStay(item.stayMinutes)}</span> : null}
        {item.estimatedCost !== null ? (
          <span>💸 {formatBudget(item.estimatedCost)}</span>
        ) : null}
      </div>
    </div>
    {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
  </div>
)
