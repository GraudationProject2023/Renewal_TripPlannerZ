'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useCreateTrip } from '../model/mutations'
import { tripCreateSchema, type TripCreateInputSchema } from '../model/schema'

type TripCreateDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: (tripId: number) => void
}

const fieldClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none transition-colors focus:border-primary-600'

const labelClass = 'text-l500-14 text-neutral-700'
const errorClass = 'text-l500-12 text-error-600'

const DEFAULT_VALUES: TripCreateInputSchema = {
  title: '',
  destination: '',
  startDate: '',
  endDate: '',
  budget: 0,
  visibility: 'PRIVATE',
}

export const TripCreateDialog = ({
  open,
  onClose,
  onCreated,
}: TripCreateDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripCreateInputSchema>({
    resolver: zodResolver(tripCreateSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const createTrip = useCreateTrip()

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
      createTrip.reset()
    }
  }, [open, reset, createTrip])

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
    createTrip.mutate(values, {
      onSuccess: (trip) => {
        onCreated?.(trip.id)
        onClose()
      },
    })
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trip-create-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-card bg-neutral-0 p-6 shadow-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 id="trip-create-title" className="text-h700-24 font-bold text-neutral-900">
            새 여행 만들기
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="trip-title">
              제목
            </label>
            <input
              id="trip-title"
              type="text"
              placeholder="예: 6월 오사카 3박 4일"
              className={fieldClass}
              {...register('title')}
            />
            {errors.title && <p className={errorClass}>{errors.title.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="trip-destination">
              목적지
            </label>
            <input
              id="trip-destination"
              type="text"
              placeholder="예: 오사카, 일본"
              className={fieldClass}
              {...register('destination')}
            />
            {errors.destination && (
              <p className={errorClass}>{errors.destination.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="trip-start">
                시작일
              </label>
              <input
                id="trip-start"
                type="date"
                className={fieldClass}
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className={errorClass}>{errors.startDate.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="trip-end">
                종료일
              </label>
              <input
                id="trip-end"
                type="date"
                className={fieldClass}
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className={errorClass}>{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="trip-budget">
              예산 (원)
            </label>
            <input
              id="trip-budget"
              type="number"
              min={0}
              step={10000}
              className={fieldClass}
              {...register('budget', { valueAsNumber: true })}
            />
            {errors.budget && <p className={errorClass}>{errors.budget.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <span className={labelClass}>공개 범위</span>
            <div className="flex gap-2">
              {(['PRIVATE', 'PUBLIC'] as const).map((v) => (
                <label
                  key={v}
                  className={clsx(
                    'flex-1 cursor-pointer rounded-lg border px-3 py-2 text-l500-14 transition-colors',
                    'has-[:checked]:border-primary-600 has-[:checked]:bg-primary-50 has-[:checked]:text-primary-700',
                    'border-neutral-300 text-neutral-600 hover:bg-neutral-50',
                  )}
                >
                  <input
                    type="radio"
                    value={v}
                    className="sr-only"
                    {...register('visibility')}
                  />
                  <span className="block text-center">
                    {v === 'PRIVATE' ? '비공개' : '공개'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {createTrip.isError && (
            <p className={errorClass}>
              {createTrip.error instanceof ApiRequestError
                ? createTrip.error.message
                : '여행 생성에 실패했습니다.'}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outlined-secondary"
              size="md"
              onClick={onClose}
              disabled={createTrip.isPending}
            >
              취소
            </Button>
            <Button type="submit" size="md" disabled={createTrip.isPending}>
              {createTrip.isPending ? '생성 중…' : '만들기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
