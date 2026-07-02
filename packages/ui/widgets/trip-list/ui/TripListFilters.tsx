'use client'
import { Search } from 'lucide-react'
import { cn, Input } from '../../../shared/ui'
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
          className={cn(
            'rounded-full border px-3 py-1.5 text-l500-14 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
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
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        aria-hidden
      />
      <Input
        type="search"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="제목·목적지 검색"
        className="pl-9"
        aria-label="여행 검색"
      />
    </div>
  </div>
)
