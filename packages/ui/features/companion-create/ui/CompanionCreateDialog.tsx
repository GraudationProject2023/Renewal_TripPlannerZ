'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useCreateCompanion } from '../model/mutations'
import { companionCreateSchema, type CompanionCreateInputSchema } from '../model/schema'

type CompanionCreateDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: (companionId: number) => void
}

const fieldClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none transition-colors focus:border-primary-600'
const labelClass = 'text-l500-14 text-neutral-700'
const errorClass = 'text-l500-12 text-error-600'

const DEFAULT_VALUES: CompanionCreateInputSchema = {
  title: '',
  content: null,
  destination: '',
  startDate: '',
  endDate: '',
  capacity: 2,
  budget: null,
  tripId: null,
}

export const CompanionCreateDialog = ({
  open,
  onClose,
  onCreated,
}: CompanionCreateDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanionCreateInputSchema>({
    resolver: zodResolver(companionCreateSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const create = useCreateCompanion()

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
      create.reset()
    }
  }, [open, reset, create])

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
    create.mutate(values, {
      onSuccess: (companion) => {
        onCreated?.(companion.id)
        onClose()
      },
    })
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-card bg-neutral-0 p-6 shadow-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-h700-24 font-bold text-neutral-900">동행 모집글 작성</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="c-title">
              제목
            </label>
            <input
              id="c-title"
              type="text"
              placeholder="예: 6월 오사카 3박 4일 같이 갈 분!"
              className={fieldClass}
              {...register('title')}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="c-destination">
              목적지
            </label>
            <input
              id="c-destination"
              type="text"
              placeholder="예: 오사카"
              className={fieldClass}
              {...register('destination')}
            />
            {errors.destination && (
              <p className={errorClass}>{errors.destination.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="c-start">
                시작일
              </label>
              <input
                id="c-start"
                type="date"
                className={fieldClass}
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className={errorClass}>{errors.startDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="c-end">
                종료일
              </label>
              <input
                id="c-end"
                type="date"
                className={fieldClass}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className={errorClass}>{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="c-capacity">
                모집 인원
              </label>
              <input
                id="c-capacity"
                type="number"
                min={2}
                step={1}
                className={fieldClass}
                {...register('capacity', { valueAsNumber: true })}
              />
              {errors.capacity && (
                <p className={errorClass}>{errors.capacity.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="c-budget">
                예상 예산 (원)
              </label>
              <input
                id="c-budget"
                type="number"
                min={0}
                step={10000}
                placeholder="선택"
                className={fieldClass}
                {...register('budget', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
              {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="c-content">
              상세 내용
            </label>
            <textarea
              id="c-content"
              rows={5}
              placeholder="일정, 선호 성향, 연락 방식 등을 자유롭게 적어주세요."
              className={fieldClass}
              {...register('content')}
            />
            {errors.content && <p className={errorClass}>{errors.content.message}</p>}
          </div>

          {create.isError && (
            <p className={errorClass}>
              {create.error instanceof ApiRequestError
                ? create.error.message
                : '모집글 작성에 실패했습니다.'}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outlined-secondary"
              size="md"
              onClick={onClose}
              disabled={create.isPending}
            >
              취소
            </Button>
            <Button type="submit" size="md" disabled={create.isPending}>
              {create.isPending ? '등록 중…' : '등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
