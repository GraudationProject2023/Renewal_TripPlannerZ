import { clsx } from 'clsx'
import { formatDateRange } from '../../../shared/lib'
import type { CompanionSummary } from '../model/types'
import { CompanionStatusBadge } from './CompanionStatusBadge'

type CompanionCardProps = {
  companion: CompanionSummary
  href?: string
  className?: string
}

export const CompanionCard = ({ companion, href, className }: CompanionCardProps) => {
  const content = (
    <div
      className={clsx(
        'flex h-full flex-col justify-between rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-all',
        href && 'hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-100',
        companion.status === 'CLOSED' && 'opacity-70',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-l500-12 text-neutral-500">
            📍 {companion.destination}
          </p>
          <h3 className="mt-1 truncate text-t600-16 font-semibold text-neutral-900">
            {companion.title}
          </h3>
        </div>
        <CompanionStatusBadge status={companion.status} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 text-l500-14 text-neutral-600">
        <span>{formatDateRange(companion.startDate, companion.endDate)}</span>
        <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-l500-12 text-neutral-600">
          👥 {companion.capacity}명
        </span>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    )
  }
  return content
}
