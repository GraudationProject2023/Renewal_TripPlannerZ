'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useApplyCompanion } from '../model/mutations'
import {
  applicationCreateSchema,
  type ApplicationCreateInputSchema,
} from '../model/schema'

type CompanionApplyDialogProps = {
  companionId: number
  open: boolean
  onClose: () => void
}

const fieldClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none transition-colors focus:border-primary-600'
const labelClass = 'text-l500-14 text-neutral-700'
const errorClass = 'text-l500-12 text-error-600'

const DEFAULT_VALUES: ApplicationCreateInputSchema = { message: null }

export const CompanionApplyDialog = ({
  companionId,
  open,
  onClose,
}: CompanionApplyDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationCreateInputSchema>({
    resolver: zodResolver(applicationCreateSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const apply = useApplyCompanion(companionId)

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
      apply.reset()
    }
  }, [open, reset, apply])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const onSubmit = handleSubmit((values) => {
    apply.mutate(values, { onSuccess: () => onClose() })
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-card bg-neutral-0 p-6 shadow-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-h700-24 font-bold text-neutral-900">동행 지원</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <p className="mt-2 text-l500-14 text-neutral-500">
          호스트에게 전달할 인사말과 자기소개를 남겨보세요.
        </p>

        <form className="mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="apply-message">
              메시지 (선택)
            </label>
            <textarea
              id="apply-message"
              rows={5}
              placeholder="예: 안녕하세요! 오사카 여행 함께 가고 싶어요."
              className={fieldClass}
              {...register('message')}
            />
            {errors.message && <p className={errorClass}>{errors.message.message}</p>}
          </div>

          {apply.isError && (
            <p className={errorClass}>
              {apply.error instanceof ApiRequestError
                ? apply.error.message
                : '지원에 실패했습니다.'}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outlined-secondary"
              size="md"
              onClick={onClose}
              disabled={apply.isPending}
            >
              취소
            </Button>
            <Button type="submit" size="md" disabled={apply.isPending}>
              {apply.isPending ? '보내는 중…' : '지원 보내기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
