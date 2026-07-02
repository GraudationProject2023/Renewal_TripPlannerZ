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
import { useCreateCompanion } from '../model/mutations'
import { companionCreateSchema, type CompanionCreateInputSchema } from '../model/schema'

type CompanionCreateDialogProps = {
  open: boolean
  onClose: () => void
  onCreated?: (companionId: number) => void
}

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

  const onSubmit = handleSubmit((values) => {
    create.mutate(values, {
      onSuccess: (companion) => {
        onCreated?.(companion.id)
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
          create.reset()
        }
      }}
    >
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>동행 모집글 작성</DialogTitle>
        </DialogHeader>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <FormField htmlFor="c-title" label="제목" required error={errors.title?.message}>
            <Input
              id="c-title"
              placeholder="예: 6월 오사카 3박 4일 같이 갈 분!"
              invalid={Boolean(errors.title)}
              {...register('title')}
            />
          </FormField>

          <FormField
            htmlFor="c-destination"
            label="목적지"
            required
            error={errors.destination?.message}
          >
            <Input
              id="c-destination"
              placeholder="예: 오사카"
              invalid={Boolean(errors.destination)}
              {...register('destination')}
            />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              htmlFor="c-start"
              label="시작일"
              required
              error={errors.startDate?.message}
            >
              <Input
                id="c-start"
                type="date"
                invalid={Boolean(errors.startDate)}
                {...register('startDate')}
              />
            </FormField>
            <FormField
              htmlFor="c-end"
              label="종료일"
              required
              error={errors.endDate?.message}
            >
              <Input
                id="c-end"
                type="date"
                invalid={Boolean(errors.endDate)}
                {...register('endDate')}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField
              htmlFor="c-capacity"
              label="모집 인원"
              required
              error={errors.capacity?.message}
            >
              <Input
                id="c-capacity"
                type="number"
                min={2}
                step={1}
                invalid={Boolean(errors.capacity)}
                {...register('capacity', { valueAsNumber: true })}
              />
            </FormField>
            <FormField
              htmlFor="c-budget"
              label="예상 예산 (원)"
              error={errors.budget?.message}
            >
              <Input
                id="c-budget"
                type="number"
                min={0}
                step={10000}
                placeholder="선택"
                invalid={Boolean(errors.budget)}
                {...register('budget', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
              />
            </FormField>
          </div>

          <FormField htmlFor="c-content" label="상세 내용" error={errors.content?.message}>
            <Textarea
              id="c-content"
              rows={5}
              placeholder="일정, 선호 성향, 연락 방식 등을 자유롭게 적어주세요."
              invalid={Boolean(errors.content)}
              {...register('content')}
            />
          </FormField>

          {create.isError && (
            <Alert variant="error">
              {create.error instanceof ApiRequestError
                ? create.error.message
                : '모집글 작성에 실패했습니다.'}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outlined-secondary"
              onClick={onClose}
              disabled={create.isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? '등록 중…' : '등록'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
