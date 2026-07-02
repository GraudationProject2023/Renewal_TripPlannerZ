'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useAddTripItem } from '../model/mutations'
import { tripItemAddSchema, type TripItemAddInputSchema } from '../model/schema'

type TripItemAddDialogProps = {
  tripId: number
  dayNumber: number
  /** 현재 dayNumber에서 다음에 붙일 sortOrder(=기존 개수). */
  nextSortOrder: number
  open: boolean
  onClose: () => void
}

const fieldClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none transition-colors focus:border-primary-600'
const labelClass = 'text-l500-14 text-neutral-700'
const errorClass = 'text-l500-12 text-error-600'

const DEFAULT_VALUES: TripItemAddInputSchema = {
  placeName: '',
  memo: null,
  estimatedCost: null,
  stayMinutes: null,
}

export const TripItemAddDialog = ({
  tripId,
  dayNumber,
  nextSortOrder,
  open,
  onClose,
}: TripItemAddDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TripItemAddInputSchema>({
    resolver: zodResolver(tripItemAddSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const addItem = useAddTripItem(tripId)

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES)
      addItem.reset()
    }
  }, [open, reset, addItem])

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
    addItem.mutate(
      {
        dayNumber,
        sortOrder: nextSortOrder,
        placeName: values.placeName,
        memo: values.memo,
        estimatedCost: values.estimatedCost,
        stayMinutes: values.stayMinutes,
      },
      { onSuccess: () => onClose() },
    )
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
          <h2 className="text-h700-24 font-bold text-neutral-900">
            {dayNumber}일차 장소 추가
          </h2>
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
            <label className={labelClass} htmlFor="place-name">
              장소명
            </label>
            <input
              id="place-name"
              type="text"
              placeholder="예: 도톤보리"
              className={fieldClass}
              {...register('placeName')}
            />
            {errors.placeName && (
              <p className={errorClass}>{errors.placeName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="memo">
              메모
            </label>
            <textarea
              id="memo"
              rows={3}
              placeholder="선택 사항"
              className={fieldClass}
              {...register('memo')}
            />
            {errors.memo && <p className={errorClass}>{errors.memo.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="cost">
                예상 비용 (원)
              </label>
              <input
                id="cost"
                type="number"
                min={0}
                step={1000}
                placeholder="0"
                className={fieldClass}
                {...register('estimatedCost', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
              {errors.estimatedCost && (
                <p className={errorClass}>{errors.estimatedCost.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="stay">
                체류 시간 (분)
              </label>
              <input
                id="stay"
                type="number"
                min={0}
                step={15}
                placeholder="0"
                className={fieldClass}
                {...register('stayMinutes', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
              {errors.stayMinutes && (
                <p className={errorClass}>{errors.stayMinutes.message}</p>
              )}
            </div>
          </div>

          {addItem.isError && (
            <p className={errorClass}>
              {addItem.error instanceof ApiRequestError
                ? addItem.error.message
                : '장소 추가에 실패했습니다.'}
            </p>
          )}

          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outlined-secondary"
              size="md"
              onClick={onClose}
              disabled={addItem.isPending}
            >
              취소
            </Button>
            <Button type="submit" size="md" disabled={addItem.isPending}>
              {addItem.isPending ? '추가 중…' : '추가'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
