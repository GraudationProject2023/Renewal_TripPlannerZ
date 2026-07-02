import { MapPin } from 'lucide-react'
import { cn } from '../../../shared/ui'
import { formatTripPeriod } from '../lib/format'
import type { TripSummary } from '../model/types'
import { TripVisibilityBadge } from './TripVisibilityBadge'

type TripCardProps = {
  trip: TripSummary
  href?: string
  className?: string
}

export const TripCard = ({ trip, href, className }: TripCardProps) => {
  const content = (
    <div
      className={cn(
        'group flex h-full flex-col justify-between rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-all',
        href && 'hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-100',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-1 truncate text-l500-12 text-neutral-500">
            <MapPin className="h-3 w-3" aria-hidden />
            {trip.destination}
          </p>
          <h3 className="mt-1 truncate text-t600-16 font-semibold text-neutral-900">
            {trip.title}
          </h3>
        </div>
        <TripVisibilityBadge visibility={trip.visibility} />
      </div>

      <p className="mt-6 text-l500-14 text-neutral-600">
        {formatTripPeriod(trip.startDate, trip.endDate)}
      </p>
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
