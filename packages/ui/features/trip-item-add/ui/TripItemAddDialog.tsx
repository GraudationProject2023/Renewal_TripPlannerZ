'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Input,
  Textarea,
} from '../../../shared/ui'
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
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
        else {
          reset(DEFAULT_VALUES)
          addItem.reset()
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{dayNumber}일차 장소 추가</DialogTitle>
        </DialogHeader>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <FormField
            htmlFor="place-name"
            label="장소명"
            required
            error={errors.placeName?.message}
          >
            <Input
              id="place-name"
              placeholder="예: 도톤보리"
              invalid={Boolean(errors.placeName)}
              {...register('placeName')}
            />
          </FormField>

          <FormField htmlFor="memo" label="메모" error={errors.memo?.message}>
            <Textarea
              id="memo"
              rows={3}
              placeholder="선택 사항"
              invalid={Boolean(errors.memo)}
              {...register('memo')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              htmlFor="cost"
              label="예상 비용 (원)"
              error={errors.estimatedCost?.message}
            >
              <Input
                id="cost"
                type="number"
                min={0}
                step={1000}
                placeholder="0"
                invalid={Boolean(errors.estimatedCost)}
                {...register('estimatedCost', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
            </FormField>
            <FormField
              htmlFor="stay"
              label="체류 시간 (분)"
              error={errors.stayMinutes?.message}
            >
              <Input
                id="stay"
                type="number"
                min={0}
                step={15}
                placeholder="0"
                invalid={Boolean(errors.stayMinutes)}
                {...register('stayMinutes', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
            </FormField>
          </div>

          {addItem.isError && (
            <Alert variant="error">
              {addItem.error instanceof ApiRequestError
                ? addItem.error.message
                : '장소 추가에 실패했습니다.'}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outlined-secondary"
              onClick={onClose}
              disabled={addItem.isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={addItem.isPending}>
              {addItem.isPending ? '추가 중…' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
