import { Trash2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatIsoDate } from '../../../shared/lib'
import { CategoryBadge } from './CategoryBadge'
import { formatMoney } from '../lib/format'
import type { Expense } from '../model/types'

type ExpenseRowProps = {
  expense: Expense
  /** 결제자 표시. 위젯이 회원 이름을 주입한다(entities 간 교차의존 회피). */
  payerName?: ReactNode
  onDelete?: () => void
  deleting?: boolean
}

export const ExpenseRow = ({
  expense,
  payerName,
  onDelete,
  deleting,
}: ExpenseRowProps) => (
  <li className="flex items-center gap-4 rounded-card border border-neutral-200 bg-neutral-0 px-4 py-3 shadow-50">
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <div className="flex items-center gap-2">
        <CategoryBadge category={expense.category} />
        <span className="truncate text-l500-14 font-medium text-neutral-900">
          {expense.description || '(설명 없음)'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-l500-12 text-neutral-500">
        <span>{formatIsoDate(expense.spentOn)}</span>
        <span aria-hidden>·</span>
        <span>결제 {payerName ?? `#${expense.payerId}`}</span>
        <span aria-hidden>·</span>
        <span>{expense.shares.length}명 분담</span>
      </div>
    </div>

    <span className="shrink-0 text-l500-14 font-semibold text-neutral-900">
      {formatMoney(expense.amount)}
    </span>

    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        disabled={deleting}
        aria-label="지출 삭제"
        className="shrink-0 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-error-50 hover:text-error-600 disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden />
      </button>
    )}
  </li>
)
