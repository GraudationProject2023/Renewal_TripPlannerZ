'use client'
import { formatBudget, formatTripPeriod, TripVisibilityBadge } from '../../../entities/trip'
import type { Trip } from '../../../entities/trip'

type TripHeaderProps = {
  trip: Trip
}

export const TripHeader = ({ trip }: TripHeaderProps) => (
  <header className="flex flex-col gap-4 rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-50">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-l500-14 text-neutral-500">{trip.destination}</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="truncate text-h700-24 font-bold text-neutral-900">
            {trip.title}
          </h1>
          <TripVisibilityBadge visibility={trip.visibility} />
        </div>
      </div>
    </div>

    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="rounded-lg bg-neutral-50 px-4 py-3">
        <dt className="text-l500-12 text-neutral-500">일정</dt>
        <dd className="mt-1 text-l500-14 font-medium text-neutral-900">
          {formatTripPeriod(trip.startDate, trip.endDate)}
        </dd>
      </div>
      <div className="rounded-lg bg-neutral-50 px-4 py-3">
        <dt className="text-l500-12 text-neutral-500">예산</dt>
        <dd className="mt-1 text-l500-14 font-medium text-neutral-900">
          {formatBudget(trip.budget)}
        </dd>
      </div>
    </dl>
  </header>
)
