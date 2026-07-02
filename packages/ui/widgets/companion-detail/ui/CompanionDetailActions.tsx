'use client'
import { CheckCircle2, Lock, LogIn, Send } from 'lucide-react'
import { useState } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import type { Companion } from '../../../entities/companion'
import { CompanionApplyDialog } from '../../../features/companion-apply'
import { useCloseCompanion } from '../../../features/companion-close'

type CompanionDetailActionsProps = {
  companion: Companion
  isHost: boolean
  isAuthenticated: boolean
}

export const CompanionDetailActions = ({
  companion,
  isHost,
  isAuthenticated,
}: CompanionDetailActionsProps) => {
  const [applyOpen, setApplyOpen] = useState(false)
  const close = useCloseCompanion(companion.id)

  const isRecruiting = companion.status === 'RECRUITING'

  if (isHost) {
    return (
      <>
        {isRecruiting ? (
          <Button
            variant="outlined-secondary"
            size="md"
            icon={<CheckCircle2 className="h-4 w-4" />}
            onClick={() => {
              if (typeof window !== 'undefined' && !window.confirm('모집을 마감할까요?')) return
              close.mutate()
            }}
            disabled={close.isPending}
          >
            {close.isPending ? '마감 중…' : '모집 마감'}
          </Button>
        ) : (
          <span className="text-l500-14 text-neutral-500">이미 마감된 모집입니다.</span>
        )}
        {close.isError && (
          <p className="text-l500-12 text-error-600">
            {close.error instanceof ApiRequestError
              ? close.error.message
              : '마감에 실패했습니다.'}
          </p>
        )}
      </>
    )
  }

  if (!isRecruiting) {
    return (
      <Button size="md" variant="outlined-assistive" icon={<Lock className="h-4 w-4" />} disabled>
        마감된 모집
      </Button>
    )
  }

  if (!isAuthenticated) {
    return (
      <Button
        size="md"
        onClick={() => window.location.assign('/login')}
        icon={<LogIn className="h-4 w-4" />}
      >
        로그인 후 지원하기
      </Button>
    )
  }

  return (
    <>
      <Button size="md" onClick={() => setApplyOpen(true)} icon={<Send className="h-4 w-4" />}>
        지원하기
      </Button>
      <CompanionApplyDialog
        companionId={companion.id}
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
      />
    </>
  )
}
