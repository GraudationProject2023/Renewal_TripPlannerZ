'use client'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Card, CardContent } from '../../../shared/ui'
import {
  CategoryBadge,
  categoryMeta,
  formatMoney,
  useBudgetSummary,
} from '../../../entities/budget'

type BudgetSummaryCardProps = {
  tripId: number
}

export const BudgetSummaryCard = ({ tripId }: BudgetSummaryCardProps) => {
  const { data, isLoading, isError, error } = useBudgetSummary(tripId)

  if (isLoading) {
    return (
      <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
    )
  }

  if (isError || !data) {
    return (
      <Alert variant="error" title="예산 요약을 불러오지 못했습니다">
        <p>
          {error instanceof ApiRequestError
            ? error.message
            : '잠시 후 다시 시도해 주세요.'}
        </p>
      </Alert>
    )
  }

  const overspent = data.remaining !== null && data.remaining < 0
  const maxCategory = Math.max(1, ...data.byCategory.map((c) => c.amount))

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6">
        <div className="grid grid-cols-3 gap-4">
          <Metric label="계획 예산" value={formatMoney(data.plannedBudget)} />
          <Metric
            label="총 지출"
            value={formatMoney(data.totalSpent)}
            accent="neutral"
          />
          <Metric
            label={overspent ? '초과' : '남은 예산'}
            value={
              data.remaining === null
                ? '—'
                : formatMoney(Math.abs(data.remaining))
            }
            accent={overspent ? 'error' : 'success'}
          />
        </div>

        {data.byCategory.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-neutral-100 pt-4">
            {data.byCategory
              .slice()
              .sort((a, b) => b.amount - a.amount)
              .map((c) => (
                <div key={c.category} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category={c.category} />
                    <span className="text-l500-14 font-medium text-neutral-800">
                      {formatMoney(c.amount)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-primary-400"
                      style={{
                        width: `${Math.round((c.amount / maxCategory) * 100)}%`,
                      }}
                      aria-label={`${categoryMeta(c.category).label} 지출 비중`}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const Metric = ({
  label,
  value,
  accent = 'neutral',
}: {
  label: string
  value: string
  accent?: 'neutral' | 'success' | 'error'
}) => {
  const color =
    accent === 'success'
      ? 'text-success-700'
      : accent === 'error'
        ? 'text-error-600'
        : 'text-neutral-900'
  return (
    <div className="flex flex-col gap-1">
      <span className="text-l500-12 text-neutral-500">{label}</span>
      <span className={`text-h700-20 font-bold ${color}`}>{value}</span>
    </div>
  )
}
