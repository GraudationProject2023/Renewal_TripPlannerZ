'use client'
import { formatDateRange, formatKrw } from '../../../shared/lib'
import {
  CompanionStatusBadge,
  type Companion,
} from '../../../entities/companion'

type CompanionDetailHeaderProps = {
  companion: Companion
  actions?: React.ReactNode
}

export const CompanionDetailHeader = ({
  companion,
  actions,
}: CompanionDetailHeaderProps) => (
  <header className="flex flex-col gap-4 rounded-card border border-neutral-200 bg-neutral-0 p-6 shadow-50">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <p className="text-l500-14 text-neutral-500">📍 {companion.destination}</p>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="truncate text-h700-24 font-bold text-neutral-900">
            {companion.title}
          </h1>
          <CompanionStatusBadge status={companion.status} />
        </div>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </div>

    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-lg bg-neutral-50 px-4 py-3">
        <dt className="text-l500-12 text-neutral-500">일정</dt>
        <dd className="mt-1 text-l500-14 font-medium text-neutral-900">
          {formatDateRange(companion.startDate, companion.endDate)}
        </dd>
      </div>
      <div className="rounded-lg bg-neutral-50 px-4 py-3">
        <dt className="text-l500-12 text-neutral-500">모집 인원</dt>
        <dd className="mt-1 text-l500-14 font-medium text-neutral-900">
          {companion.capacity}명
        </dd>
      </div>
      <div className="rounded-lg bg-neutral-50 px-4 py-3">
        <dt className="text-l500-12 text-neutral-500">예상 예산</dt>
        <dd className="mt-1 text-l500-14 font-medium text-neutral-900">
          {formatKrw(companion.budget)}
        </dd>
      </div>
    </dl>
  </header>
)
