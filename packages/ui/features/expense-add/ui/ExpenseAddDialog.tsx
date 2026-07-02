'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { clsx } from 'clsx'
import { Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
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
} from '../../../shared/ui'
import { EXPENSE_CATEGORIES, useExpenses } from '../../../entities/budget'
import { MemberName, useMe } from '../../../entities/user'
import { useCreateExpense } from '../model/mutations'
import { expenseAddSchema, type ExpenseAddSchema } from '../model/schema'

type ExpenseAddDialogProps = {
  tripId: number
  open: boolean
  onClose: () => void
}

const todayIso = () => new Date().toISOString().slice(0, 10)

const baseDefaults = (): ExpenseAddSchema => ({
  payerId: 0,
  amount: 0,
  category: 'FOOD',
  description: '',
  spentOn: todayIso(),
  participantIds: [],
})

export const ExpenseAddDialog = ({
  tripId,
  open,
  onClose,
}: ExpenseAddDialogProps) => {
  const { data: me } = useMe()
  const { data: expenses } = useExpenses(open ? tripId : undefined)
  const [extraIds, setExtraIds] = useState<number[]>([])
  const [memberInput, setMemberInput] = useState('')

  /** 결제자·분담 후보 회원. 현재 사용자 + 기존 지출 참여자 + 수기 추가. */
  const roster = useMemo(() => {
    const set = new Set<number>()
    if (me) set.add(me.id)
    expenses?.forEach((e) => {
      set.add(e.payerId)
      e.shares.forEach((s) => set.add(s.memberId))
    })
    extraIds.forEach((id) => set.add(id))
    return [...set].sort((a, b) => a - b)
  }, [me, expenses, extraIds])

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ExpenseAddSchema>({
    resolver: zodResolver(expenseAddSchema),
    defaultValues: baseDefaults(),
  })
  const createExpense = useCreateExpense(tripId)

  // 다이얼로그가 열리고 현재 사용자가 로드되면 한 번만 초기화한다.
  const seededRef = useRef(false)
  useEffect(() => {
    if (!open) {
      seededRef.current = false
      return
    }
    if (seededRef.current || !me) return
    seededRef.current = true
    reset({
      ...baseDefaults(),
      payerId: me.id,
      participantIds: roster,
    })
    createExpense.reset()
    setExtraIds([])
    setMemberInput('')
  }, [open, me, roster, reset, createExpense])

  const toggleParticipant = (id: number) => {
    const current = getValues('participantIds')
    setValue(
      'participantIds',
      current.includes(id)
        ? current.filter((x) => x !== id)
        : [...current, id],
      { shouldValidate: true },
    )
  }

  const addMember = () => {
    const id = Number(memberInput)
    if (!Number.isInteger(id) || id <= 0) return
    if (!roster.includes(id)) setExtraIds((prev) => [...prev, id])
    const current = getValues('participantIds')
    if (!current.includes(id)) {
      setValue('participantIds', [...current, id], { shouldValidate: true })
    }
    setMemberInput('')
  }

  const onSubmit = handleSubmit((values) => {
    createExpense.mutate(
      {
        payerId: values.payerId,
        amount: values.amount,
        category: values.category,
        description: values.description?.trim() || undefined,
        spentOn: values.spentOn,
        participantIds: values.participantIds,
      },
      { onSuccess: () => onClose() },
    )
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>지출 추가</DialogTitle>
        </DialogHeader>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <FormField htmlFor="expense-amount" label="금액 (원)" required error={errors.amount?.message}>
              <Input
                id="expense-amount"
                type="number"
                min={0}
                step={1000}
                invalid={Boolean(errors.amount)}
                {...register('amount', { valueAsNumber: true })}
              />
            </FormField>
            <FormField htmlFor="expense-date" label="지출일" required error={errors.spentOn?.message}>
              <Input
                id="expense-date"
                type="date"
                invalid={Boolean(errors.spentOn)}
                {...register('spentOn')}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-l500-14 font-medium text-neutral-700">카테고리</span>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-2">
                  {EXPENSE_CATEGORIES.map(({ value, label, icon: Icon }) => {
                    const active = field.value === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => field.onChange(value)}
                        className={clsx(
                          'flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-l500-14 transition-colors',
                          active
                            ? 'border-primary-500 bg-primary-50 font-semibold text-primary-700'
                            : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50',
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            />
          </div>

          <FormField
            htmlFor="expense-desc"
            label="설명"
            error={errors.description?.message}
          >
            <Input
              id="expense-desc"
              placeholder="예: 저녁 식사 (신세카이 쿠시카츠)"
              invalid={Boolean(errors.description)}
              {...register('description')}
            />
          </FormField>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-l500-14 font-medium text-neutral-700">
                결제자 · 분담 참여자
              </span>
              <span className="text-l500-12 text-neutral-400">N빵으로 균등 분할</span>
            </div>

            <Controller
              control={control}
              name="payerId"
              render={({ field: payerField }) => (
                <Controller
                  control={control}
                  name="participantIds"
                  render={({ field: partField }) => (
                    <ul className="flex flex-col gap-1.5 rounded-card border border-neutral-200 p-2">
                      {roster.length === 0 && (
                        <li className="px-2 py-3 text-l500-14 text-neutral-400">
                          회원을 불러오는 중…
                        </li>
                      )}
                      {roster.map((id) => {
                        const checked = partField.value.includes(id)
                        return (
                          <li
                            key={id}
                            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-neutral-50"
                          >
                            <label className="flex items-center gap-1.5 text-l500-12 text-neutral-500">
                              <input
                                type="radio"
                                name="expense-payer"
                                checked={payerField.value === id}
                                onChange={() => payerField.onChange(id)}
                                className="h-3.5 w-3.5 accent-primary-600"
                              />
                              결제
                            </label>
                            <label className="flex flex-1 items-center gap-2 text-l500-14 text-neutral-800">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleParticipant(id)}
                                className="h-4 w-4 accent-primary-600"
                              />
                              <MemberName id={id} meId={me?.id} />
                            </label>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                />
              )}
            />
            {errors.participantIds && (
              <span className="text-l500-12 text-error-600">
                {errors.participantIds.message}
              </span>
            )}
            {errors.payerId && (
              <span className="text-l500-12 text-error-600">
                {errors.payerId.message}
              </span>
            )}

            <div className="flex items-center gap-2">
              <Input
                type="number"
                min={1}
                placeholder="회원 ID로 참여자 추가"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addMember()
                  }
                }}
              />
              <Button
                type="button"
                variant="outlined-secondary"
                onClick={addMember}
                icon={<Plus className="h-4 w-4" />}
              >
                추가
              </Button>
            </div>
          </div>

          {createExpense.isError && (
            <Alert variant="error">
              {createExpense.error instanceof ApiRequestError
                ? createExpense.error.message
                : '지출 추가에 실패했습니다.'}
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outlined-secondary"
              onClick={onClose}
              disabled={createExpense.isPending}
            >
              취소
            </Button>
            <Button type="submit" disabled={createExpense.isPending}>
              {createExpense.isPending ? '추가 중…' : '추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
