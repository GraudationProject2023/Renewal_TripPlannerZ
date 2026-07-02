'use client'
import { Plus, Receipt } from 'lucide-react'
import { useState } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button } from '../../../shared/ui'
import { ExpenseRow, formatMoney, useExpenses } from '../../../entities/budget'
import { MemberName, useMe } from '../../../entities/user'
import { ExpenseAddDialog } from '../../../features/expense-add'
import { useDeleteExpense } from '../../../features/expense-delete'

type ExpenseListSectionProps = {
  tripId: number
}

export const ExpenseListSection = ({ tripId }: ExpenseListSectionProps) => {
  const { data: expenses, isLoading, isError, error, refetch } =
    useExpenses(tripId)
  const { data: me } = useMe()
  const deleteExpense = useDeleteExpense(tripId)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const total = (expenses ?? []).reduce((sum, e) => sum + e.amount, 0)

  const handleDelete = (id: number) => {
    if (!window.confirm('이 지출을 삭제할까요?')) return
    setPendingId(id)
    deleteExpense.mutate(id, { onSettled: () => setPendingId(null) })
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-h700-18 font-bold text-neutral-900">지출 내역</h2>
          {expenses && expenses.length > 0 && (
            <p className="mt-0.5 text-l500-12 text-neutral-500">
              총 {expenses.length}건 · {formatMoney(total)}
            </p>
          )}
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          icon={<Plus className="h-4 w-4" />}
        >
          지출 추가
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50"
            />
          ))}
        </div>
      ) : isError ? (
        <Alert variant="error" title="지출 내역을 불러오지 못했습니다">
          <p>
            {error instanceof ApiRequestError
              ? error.message
              : '잠시 후 다시 시도해 주세요.'}
          </p>
          <Button
            variant="outlined-secondary"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
          >
            다시 시도
          </Button>
        </Alert>
      ) : !expenses || expenses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-neutral-200 py-12 text-center">
          <Receipt className="h-8 w-8 text-neutral-300" aria-hidden />
          <p className="text-l500-14 text-neutral-500">
            아직 등록된 지출이 없어요.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            첫 지출 추가하기
          </Button>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {expenses.map((expense) => (
            <ExpenseRow
              key={expense.id}
              expense={expense}
              payerName={<MemberName id={expense.payerId} meId={me?.id} />}
              onDelete={() => handleDelete(expense.id)}
              deleting={pendingId === expense.id}
            />
          ))}
        </ul>
      )}

      <ExpenseAddDialog
        tripId={tripId}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
      />
    </section>
  )
}
