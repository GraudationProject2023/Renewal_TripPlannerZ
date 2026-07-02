'use client'
import { clsx } from 'clsx'
import { Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Alert, Button } from '../../../shared/ui'
import { useMyTrips } from '../../../entities/trip'
import { DashboardShell } from '../../../widgets/dashboard-shell'
import { BudgetSummaryCard } from '../../../widgets/budget-summary'
import { ExpenseListSection } from '../../../widgets/expense-list'
import { SettlementPanel } from '../../../widgets/settlement-panel'

type BudgetTab = 'expenses' | 'settlement'

const TABS: { value: BudgetTab; label: string }[] = [
  { value: 'expenses', label: '지출 내역' },
  { value: 'settlement', label: '정산' },
]

export const BudgetPage = () => {
  const { data, isLoading, isError } = useMyTrips()
  const trips = data?.content ?? []
  const [tripId, setTripId] = useState<number | null>(null)
  const [tab, setTab] = useState<BudgetTab>('expenses')

  useEffect(() => {
    if (tripId === null && trips.length > 0) setTripId(trips[0]!.id)
  }, [trips, tripId])

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-h700-24 font-bold text-neutral-900">예산 · 정산</h1>
            <p className="mt-1 text-l500-14 text-neutral-500">
              여행별 지출을 기록하고 동행자와 N빵으로 정산하세요.
            </p>
          </div>
          {trips.length > 0 && (
            <label className="flex items-center gap-2 text-l500-14 text-neutral-600">
              여행
              <select
                value={tripId ?? ''}
                onChange={(e) => setTripId(Number(e.target.value))}
                className="rounded-lg border border-neutral-300 bg-neutral-0 px-3 py-2 text-l500-14 text-neutral-800 focus:border-primary-500 focus:outline-none"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} · {t.destination}
                  </option>
                ))}
              </select>
            </label>
          )}
        </header>

        {isLoading ? (
          <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
        ) : isError ? (
          <Alert variant="error" title="여행 목록을 불러오지 못했습니다">
            <p>잠시 후 다시 시도해 주세요.</p>
          </Alert>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-neutral-200 py-16 text-center">
            <Wallet className="h-10 w-10 text-neutral-300" aria-hidden />
            <p className="text-l500-14 text-neutral-500">
              예산을 관리할 여행이 아직 없어요.
            </p>
            <Button onClick={() => window.location.assign('/trips')}>
              여행 만들러 가기
            </Button>
          </div>
        ) : tripId !== null ? (
          <>
            <BudgetSummaryCard tripId={tripId} />

            <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
              {TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTab(value)}
                  className={clsx(
                    'flex-1 rounded-md px-4 py-2 text-l500-14 transition-colors',
                    tab === value
                      ? 'bg-neutral-0 font-semibold text-neutral-900 shadow-50'
                      : 'text-neutral-500 hover:text-neutral-700',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === 'expenses' ? (
              <ExpenseListSection tripId={tripId} />
            ) : (
              <SettlementPanel tripId={tripId} />
            )}
          </>
        ) : null}
      </div>
    </DashboardShell>
  )
}
