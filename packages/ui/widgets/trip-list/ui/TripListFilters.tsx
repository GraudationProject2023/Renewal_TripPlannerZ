'use client'
import { clsx } from 'clsx'
import type { TripVisibility } from '../../../entities/trip'

export type VisibilityFilter = TripVisibility | 'ALL'

type TripListFiltersProps = {
  keyword: string
  onKeywordChange: (value: string) => void
  visibility: VisibilityFilter
  onVisibilityChange: (value: VisibilityFilter) => void
}

const CHIPS: { value: VisibilityFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'PRIVATE', label: '비공개' },
  { value: 'PUBLIC', label: '공개' },
]

export const TripListFilters = ({
  keyword,
  onKeywordChange,
  visibility,
  onVisibilityChange,
}: TripListFiltersProps) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
    <div className="flex items-center gap-2">
      {CHIPS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => onVisibilityChange(value)}
          className={clsx(
            'rounded-full border px-3 py-1.5 text-l500-14 transition-colors',
            visibility === value
              ? 'border-primary-600 bg-primary-50 text-primary-700'
              : 'border-neutral-200 bg-neutral-0 text-neutral-600 hover:border-neutral-300',
          )}
        >
          {label}
        </button>
      ))}
    </div>

    <div className="relative w-full md:w-72">
      <input
        type="search"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="제목·목적지 검색"
        className="w-full rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-2 pr-9 text-l500-14 outline-none focus:border-primary-600"
        aria-label="여행 검색"
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
        🔍
      </span>
    </div>
  </div>
)
