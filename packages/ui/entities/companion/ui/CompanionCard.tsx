import { MapPin, Users } from 'lucide-react'
import { formatDateRange } from '../../../shared/lib'
import { Badge, cn } from '../../../shared/ui'
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
      className={cn(
        'flex h-full flex-col justify-between rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-all',
        href && 'hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-100',
        companion.status === 'CLOSED' && 'opacity-70',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 truncate text-l500-12 text-neutral-500">
            <MapPin className="h-3 w-3" aria-hidden />
            {companion.destination}
          </p>
          <h3 className="mt-1 truncate text-t600-16 font-semibold text-neutral-900">
            {companion.title}
          </h3>
        </div>
        <CompanionStatusBadge status={companion.status} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-2 text-l500-14 text-neutral-600">
        <span>{formatDateRange(companion.startDate, companion.endDate)}</span>
        <Badge variant="neutral">
          <Users className="h-3 w-3" aria-hidden />
          {companion.capacity}명
        </Badge>
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
