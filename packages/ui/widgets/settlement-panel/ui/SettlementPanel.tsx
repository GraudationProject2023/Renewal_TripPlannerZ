'use client'
import { ArrowRight } from 'lucide-react'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Card, CardContent } from '../../../shared/ui'
import { formatMoney, useSettlement } from '../../../entities/budget'
import { MemberName, useMe } from '../../../entities/user'

type SettlementPanelProps = {
  tripId: number
}

export const SettlementPanel = ({ tripId }: SettlementPanelProps) => {
  const { data, isLoading, isError, error } = useSettlement(tripId)
  const { data: me } = useMe()

  if (isLoading) {
    return (
      <div className="h-40 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50" />
    )
  }

  if (isError || !data) {
    return (
      <Alert variant="error" title="정산 정보를 불러오지 못했습니다">
        <p>
          {error instanceof ApiRequestError
            ? error.message
            : '잠시 후 다시 시도해 주세요.'}
        </p>
      </Alert>
    )
  }

  if (data.balances.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-l500-14 text-neutral-500">
          지출이 등록되면 정산 결과가 표시됩니다.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h3 className="text-h700-18 font-bold text-neutral-900">정산 현황</h3>
          <ul className="flex flex-col divide-y divide-neutral-100">
            {data.balances.map((b) => (
              <li
                key={b.memberId}
                className="flex items-center justify-between py-2.5"
              >
                <div className="flex flex-col">
                  <span className="text-l500-14 font-medium text-neutral-800">
                    <MemberName id={b.memberId} meId={me?.id} />
                  </span>
                  <span className="text-l500-12 text-neutral-400">
                    결제 {formatMoney(b.paid)} · 분담 {formatMoney(b.owed)}
                  </span>
                </div>
                <span
                  className={
                    b.net > 0
                      ? 'text-l500-14 font-semibold text-success-700'
                      : b.net < 0
                        ? 'text-l500-14 font-semibold text-error-600'
                        : 'text-l500-14 font-medium text-neutral-400'
                  }
                >
                  {b.net > 0
                    ? `+${formatMoney(b.net)} 받을 돈`
                    : b.net < 0
                      ? `${formatMoney(Math.abs(b.net))} 낼 돈`
                      : '정산 완료'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-6">
          <h3 className="text-h700-18 font-bold text-neutral-900">송금 방법</h3>
          {data.transfers.length === 0 ? (
            <p className="text-l500-14 text-neutral-500">
              주고받을 금액이 없어요. 정산이 완료된 상태입니다.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {data.transfers.map((t, i) => (
                <li
                  key={`${t.fromMemberId}-${t.toMemberId}-${i}`}
                  className="flex items-center gap-2 rounded-card border border-neutral-200 px-4 py-3"
                >
                  <span className="text-l500-14 font-medium text-neutral-800">
                    <MemberName id={t.fromMemberId} meId={me?.id} />
                  </span>
                  <ArrowRight className="h-4 w-4 text-neutral-400" aria-hidden />
                  <span className="text-l500-14 font-medium text-neutral-800">
                    <MemberName id={t.toMemberId} meId={me?.id} />
                  </span>
                  <span className="ml-auto text-l500-14 font-semibold text-primary-700">
                    {formatMoney(t.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
