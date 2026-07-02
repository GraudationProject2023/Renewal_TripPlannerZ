'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
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
  RadioCard,
  RadioGroup,
} from '../../../shared/ui'
import { useCreateTrip } from '../model/mutations'
import { tripCreateSchema, type TripCreateInputSchema } from '../model/schema'

type TripCreateDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: (tripId: number) => void
}

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
    control,
    reset,
    formState: { errors },
  } = useForm<TripCreateInputSchema>({
    resolver: zodResolver(tripCreateSchema),
    defaultValues: DEFAULT_VALUES,
  })
  const createTrip = useCreateTrip()

  const onSubmit = handleSubmit((values) => {
    createTrip.mutate(values, {
      onSuccess: (trip) => {
        onCreated?.(trip.id)
        onClose()
      },
    })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
        else {
          reset(DEFAULT_VALUES)
          createTrip.reset()
        }
      }}
    >
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>새 여행 만들기</DialogTitle>
        </DialogHeader>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <FormField htmlFor="trip-title" label="제목" required error={errors.title?.message}>
            <Input
              id="trip-title"
              placeholder="예: 6월 오사카 3박 4일"
              invalid={Boolean(errors.title)}
              {...register('title')}
            />
          </FormField>

          <FormField
            htmlFor="trip-destination"
            label="목적지"
            required
            error={errors.destination?.message}
          >
            <Input
              id="trip-destination"
              placeholder="예: 오사카, 일본"
              invalid={Boolean(errors.destination)}
              {...register('destination')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              htmlFor="trip-start"
              label="시작일"
              required
              error={errors.startDate?.message}
            >
              <Input
                id="trip-start"
                type="date"
                invalid={Boolean(errors.startDate)}
                {...register('startDate')}
              />
            </FormField>
            <FormField
              htmlFor="trip-end"
              label="종료일"
              required
              error={errors.endDate?.message}
            >
              <Input
                id="trip-end"
                type="date"
                invalid={Boolean(errors.endDate)}
                {...register('endDate')}
              />
            </FormField>
          </div>

          <FormField htmlFor="trip-budget" label="예산 (원)" error={errors.budget?.message}>
            <Input
              id="trip-budget"
              type="number"
              min={0}
              step={10000}
              invalid={Boolean(errors.budget)}
              {...register('budget', { valueAsNumber: true })}
            />
          </FormField>

          <div className="flex flex-col gap-1.5">
            <span className="text-l500-14 font-medium text-neutral-700">공개 범위</span>
            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <RadioCard value="PRIVATE" label="비공개" description="나만 볼 수 있어요" />
                  <RadioCard value="PUBLIC" label="공개" description="링크로 공유할 수 있어요" />
                </RadioGroup>
              )}
            />
          </div>

          {createTrip.isError && (
            <Alert variant="error">
              {createTrip.error instanceof ApiRequestError
                ? createTrip.error.message
                : '여행 생성에 실패했습니다.'}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outlined-secondary"
              onClick={onClose}
              disabled={createTrip.isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={createTrip.isPending}>
              {createTrip.isPending ? '생성 중…' : '만들기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
