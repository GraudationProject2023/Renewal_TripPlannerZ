'use client'
import { format, parseISO } from 'date-fns'
import { Check, X } from 'lucide-react'
import { Button } from '../../../shared/ui'
import {
  ApplicationStatusBadge,
  type CompanionApplication,
} from '../../../entities/companion'

type ApplicationRowProps = {
  application: CompanionApplication
  onAccept: () => void
  onReject: () => void
  isBusy: boolean
  canDecide: boolean
}

export const ApplicationRow = ({
  application,
  onAccept,
  onReject,
  isBusy,
  canDecide,
}: ApplicationRowProps) => {
  const isPending = application.status === 'PENDING'
  return (
    <div className="rounded-card border border-neutral-200 bg-neutral-0 p-4 shadow-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-l500-14 font-semibold text-neutral-900">
              지원자 #{application.applicantId}
            </p>
            <ApplicationStatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-l500-12 text-neutral-500">
            {format(parseISO(application.createdAt), 'yyyy.MM.dd HH:mm')}
          </p>
        </div>
        {isPending && canDecide && (
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outlined-secondary"
              size="sm"
              icon={<X className="h-3.5 w-3.5" />}
              onClick={onReject}
              disabled={isBusy}
            >
              거절
            </Button>
            <Button
              size="sm"
              icon={<Check className="h-3.5 w-3.5" />}
              onClick={onAccept}
              disabled={isBusy}
            >
              수락
            </Button>
          </div>
        )}
      </div>
      {application.message && (
        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-neutral-50 p-3 text-l500-14 text-neutral-700">
          {application.message}
        </p>
      )}
    </div>
  )
}
