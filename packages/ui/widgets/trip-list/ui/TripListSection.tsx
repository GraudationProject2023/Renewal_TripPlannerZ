'use client'
import { useMemo, useState } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { TripCard, useMyTrips, type TripSummary } from '../../../entities/trip'
import { TripCreateDialog } from '../../../features/trip-create'
import { TripListEmpty } from './TripListEmpty'
import { TripListFilters, type VisibilityFilter } from './TripListFilters'
import { TripListSkeleton } from './TripListSkeleton'

const matchesKeyword = (trip: TripSummary, keyword: string): boolean => {
  if (!keyword) return true
  const normalized = keyword.trim().toLowerCase()
  return (
    trip.title.toLowerCase().includes(normalized) ||
    trip.destination.toLowerCase().includes(normalized)
  )
}

export const TripListSection = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useMyTrips()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [visibility, setVisibility] = useState<VisibilityFilter>('ALL')

  const trips = data?.content ?? []
  const filtered = useMemo(
    () =>
      trips.filter(
        (t) =>
          matchesKeyword(t, keyword) &&
          (visibility === 'ALL' || t.visibility === visibility),
      ),
    [trips, keyword, visibility],
  )

  const resetFilters = () => {
    setKeyword('')
    setVisibility('ALL')
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-h700-24 font-bold text-neutral-900">여행 일정</h1>
          <p className="mt-1 text-l500-14 text-neutral-500">
            내 여행을 관리하고 다음 계획을 세워보세요.
            {data && (
              <span className="ml-2 text-neutral-400">
                총 {data.totalElements.toLocaleString('ko-KR')}건
              </span>
            )}
          </p>
        </div>
        <Button size="lg" onClick={() => setDialogOpen(true)}>
          + 새 여행 만들기
        </Button>
      </header>

      <TripListFilters
        keyword={keyword}
        onKeywordChange={setKeyword}
        visibility={visibility}
        onVisibilityChange={setVisibility}
      />

      {isLoading ? (
        <TripListSkeleton />
      ) : isError ? (
        <div className="flex flex-col items-center justify-center rounded-card border border-error-200 bg-error-50 px-6 py-12 text-center">
          <p className="text-t600-16 font-semibold text-error-700">
            여행 목록을 불러오지 못했습니다
          </p>
          <p className="mt-1 text-l500-14 text-error-600">
            {error instanceof ApiRequestError
              ? error.message
              : '잠시 후 다시 시도해 주세요.'}
          </p>
          <Button
            variant="outlined-secondary"
            size="md"
            className="mt-4"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? '재시도 중…' : '다시 시도'}
          </Button>
        </div>
      ) : trips.length === 0 ? (
        <TripListEmpty variant="no-trips" onCreate={() => setDialogOpen(true)} />
      ) : filtered.length === 0 ? (
        <TripListEmpty variant="no-match" onReset={resetFilters} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((trip) => (
            <TripCard key={trip.id} trip={trip} href={`/trips/${trip.id}`} />
          ))}
        </div>
      )}

      <TripCreateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={(id) => window.location.assign(`/trips/${id}`)}
      />
    </section>
  )
}
