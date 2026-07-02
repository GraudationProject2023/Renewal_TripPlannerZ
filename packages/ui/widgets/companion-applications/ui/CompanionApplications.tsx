'use client'
import { useMemo } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button, Card } from '../../../shared/ui'
import {
  useCompanionApplications,
  type Companion,
} from '../../../entities/companion'
import {
  useAcceptApplication,
  useRejectApplication,
} from '../../../features/companion-application-decide'
import { ApplicationRow } from './ApplicationRow'

type CompanionApplicationsProps = {
  companion: Companion
}

export const CompanionApplications = ({ companion }: CompanionApplicationsProps) => {
  const { data, isLoading, isError, error, refetch } = useCompanionApplications(companion.id)
  const accept = useAcceptApplication(companion.id)
  const reject = useRejectApplication(companion.id)

  const busy = accept.isPending || reject.isPending
  const applications = data ?? []

  const pendingCount = useMemo(
    () => applications.filter((a) => a.status === 'PENDING').length,
    [applications],
  )

  const canDecide = companion.status === 'RECRUITING'

  return (
    <Card className="p-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-t600-16 font-semibold text-neutral-900">
            지원자 관리
          </h2>
          <p className="mt-1 text-l500-12 text-neutral-500">
            대기 중 {pendingCount}명 · 전체 {applications.length}명
          </p>
        </div>
      </header>

      {isLoading ? (
        <div className="mt-5 flex flex-col gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-card border border-neutral-200 bg-neutral-50"
            />
          ))}
        </div>
      ) : isError ? (
        <Alert variant="error" className="mt-5">
          <p>
            {error instanceof ApiRequestError
              ? error.message
              : '지원자 목록을 불러오지 못했습니다.'}
          </p>
          <Button
            variant="outlined-secondary"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            다시 시도
          </Button>
        </Alert>
      ) : applications.length === 0 ? (
        <p className="mt-5 rounded-lg border border-dashed border-neutral-300 py-10 text-center text-l500-14 text-neutral-500">
          아직 지원자가 없습니다.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              onAccept={() => accept.mutate(application.id)}
              onReject={() => reject.mutate(application.id)}
              isBusy={busy}
              canDecide={canDecide}
            />
          ))}
        </div>
      )}
    </Card>
  )
}
