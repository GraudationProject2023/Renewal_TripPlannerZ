'use client'
import { Button } from '../../../shared/ui'
import type { RouteResponse } from '../../../entities/trip'

type RoutePreviewCardProps = {
  preview: RouteResponse
  onApply: () => void
  onDismiss: () => void
  isApplying: boolean
}

export const RoutePreviewCard = ({
  preview,
  onApply,
  onDismiss,
  isApplying,
}: RoutePreviewCardProps) => (
  <div className="rounded-card border border-primary-200 bg-primary-50 p-4">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-t600-16 font-semibold text-primary-700">
          ✨ {preview.dayNumber}일차 추천 동선
        </p>
        <p className="mt-1 text-l500-12 text-primary-700/80">
          총 이동 거리 약 {preview.totalDistanceKm.toFixed(1)}km
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outlined-secondary" size="sm" onClick={onDismiss} disabled={isApplying}>
          닫기
        </Button>
        <Button size="sm" onClick={onApply} disabled={isApplying}>
          {isApplying ? '적용 중…' : '이 순서로 적용'}
        </Button>
      </div>
    </div>
    <ol className="mt-3 flex flex-col gap-1 text-l500-14 text-neutral-800">
      {preview.stops.map((stop, i) => (
        <li key={stop.itemId} className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-l500-12 text-white">
            {i + 1}
          </span>
          <span className="truncate">{stop.placeName}</span>
        </li>
      ))}
    </ol>
  </div>
)
