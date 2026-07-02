'use client'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useCompanion } from '../../../entities/companion'
import { useMe } from '../../../entities/user'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { DashboardShell } from '../../../widgets/dashboard-shell'
import { CompanionApplications } from '../../../widgets/companion-applications'
import {
  CompanionDetailActions,
  CompanionDetailBody,
  CompanionDetailHeader,
} from '../../../widgets/companion-detail'

type CompanionDetailPageProps = {
  companionId: number
}

export const CompanionDetailPage = ({ companionId }: CompanionDetailPageProps) => {
  const { data: companion, isLoading, isError, error, refetch } = useCompanion(companionId)
  const { data: me } = useMe()

  const isAuthenticated = typeof window !== 'undefined' && getAccessToken() !== null
  const isHost = Boolean(me && companion && me.id === companion.hostId)

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <a
          href="/companions"
          className="inline-flex w-fit items-center gap-1 text-l500-14 text-neutral-500 transition-colors hover:text-neutral-800"
        >
          ← 동행 목록으로
        </a>

        {isLoading ? (
          <DetailSkeleton />
        ) : isError || !companion ? (
          <div className="rounded-card border border-error-200 bg-error-50 p-6 text-center">
            <p className="text-t600-16 font-semibold text-error-700">
              모집 정보를 불러오지 못했습니다
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
            <CompanionDetailHeader
              companion={companion}
              actions={
                <CompanionDetailActions
                  companion={companion}
                  isHost={isHost}
                  isAuthenticated={isAuthenticated}
                />
              }
            />
            <CompanionDetailBody companion={companion} />
            {isHost && <CompanionApplications companion={companion} />}
          </>
        )}
      </div>
    </DashboardShell>
  )
}

const DetailSkeleton = () => (
  <div className="flex flex-col gap-6">
    <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
    <div className="h-48 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
  </div>
)
