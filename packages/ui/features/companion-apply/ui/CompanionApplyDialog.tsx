'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  FormField,
  Textarea,
} from '../../../shared/ui'
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

  const onSubmit = handleSubmit((values) => {
    apply.mutate(values, { onSuccess: () => onClose() })
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
        else {
          reset(DEFAULT_VALUES)
          apply.reset()
        }
      }}
    >
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>동행 지원</DialogTitle>
          <DialogDescription>
            호스트에게 전달할 인사말과 자기소개를 남겨보세요.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-5 flex flex-col gap-4" onSubmit={onSubmit}>
          <FormField
            htmlFor="apply-message"
            label="메시지"
            hint="선택 사항"
            error={errors.message?.message}
          >
            <Textarea
              id="apply-message"
              rows={5}
              placeholder="예: 안녕하세요! 오사카 여행 함께 가고 싶어요."
              invalid={Boolean(errors.message)}
              {...register('message')}
            />
          </FormField>

          {apply.isError && (
            <Alert variant="error">
              {apply.error instanceof ApiRequestError
                ? apply.error.message
                : '지원에 실패했습니다.'}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outlined-secondary"
              onClick={onClose}
              disabled={apply.isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={apply.isPending}>
              {apply.isPending ? '보내는 중…' : '지원 보내기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
