'use client'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useTrip } from '../../../entities/trip'
import { DashboardShell } from '../../../widgets/dashboard-shell'
import { TripHeader } from '../../../widgets/trip-header'
import { TripTimeline } from '../../../widgets/trip-timeline'

type TripDetailPageProps = {
  tripId: number
}

export const TripDetailPage = ({ tripId }: TripDetailPageProps) => {
  const { data: trip, isLoading, isError, error, refetch } = useTrip(tripId)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <a
          href="/trips"
          className="inline-flex w-fit items-center gap-1 text-l500-14 text-neutral-500 transition-colors hover:text-neutral-800"
        >
          ← 여행 목록으로
        </a>

        {isLoading ? (
          <TripDetailSkeleton />
        ) : isError || !trip ? (
          <div className="rounded-card border border-error-200 bg-error-50 p-6 text-center">
            <p className="text-t600-16 font-semibold text-error-700">
              여행 정보를 불러오지 못했습니다
            </p>
            <p className="mt-1 text-l500-14 text-error-600">
              {error instanceof ApiRequestError
                ? error.message
                : '삭제되었거나 접근 권한이 없을 수 있습니다.'}
            </p>
            <Button
              variant="outlined-secondary"
              size="md"
              className="mt-4"
              onClick={() => refetch()}
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            <TripHeader trip={trip} />
            <TripTimeline trip={trip} />
          </>
        )}
      </div>
    </DashboardShell>
  )
}

const TripDetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="h-32 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
    <div className="h-20 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-20 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50"
      />
    ))}
  </div>
)
