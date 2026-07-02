'use client'
import { MapPin, Plus, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button } from '../../../shared/ui'
import {
  countTripDays,
  useTripItems,
  type Trip,
  type TripItem,
  type TripItemOrder,
} from '../../../entities/trip'
import { TripItemAddDialog } from '../../../features/trip-item-add'
import { useDeleteTripItem } from '../../../features/trip-item-delete'
import { useReorderTripItems } from '../../../features/trip-item-reorder'
import {
  useApplyOptimizedRoute,
  useRoutePreview,
} from '../../../features/trip-route-optimize'
import { DayTabs } from './DayTabs'
import { DraggableItemRow } from './DraggableItemRow'
import { RoutePreviewCard } from './RoutePreviewCard'

type TripTimelineProps = {
  trip: Trip
}

const bySortOrder = (a: TripItem, b: TripItem) => a.sortOrder - b.sortOrder

const buildOrders = (items: TripItem[]): TripItemOrder[] =>
  items.map((item, i) => ({
    itemId: item.id,
    dayNumber: item.dayNumber,
    sortOrder: i,
  }))

export const TripTimeline = ({ trip }: TripTimelineProps) => {
  const totalDays = countTripDays(trip.startDate, trip.endDate)
  const [activeDay, setActiveDay] = useState(1)
  const [addOpen, setAddOpen] = useState(false)
  const { data: items = [], isLoading, isError, error, refetch } = useTripItems(trip.id)

  const reorder = useReorderTripItems(trip.id)
  const remove = useDeleteTripItem(trip.id)
  const preview = useRoutePreview(trip.id)
  const applyOptimized = useApplyOptimizedRoute(trip.id)

  const [localDayItems, setLocalDayItems] = useState<TripItem[]>([])

  const dayItems = useMemo(
    () => items.filter((i) => i.dayNumber === activeDay).sort(bySortOrder),
    [items, activeDay],
  )

  useEffect(() => {
    setLocalDayItems(dayItems)
  }, [dayItems])

  const countsByDay = useMemo(() => {
    const map: Record<number, number> = {}
    for (const item of items) {
      map[item.dayNumber] = (map[item.dayNumber] ?? 0) + 1
    }
    return map
  }, [items])

  const handleHover = (dragIndex: number, hoverIndex: number) => {
    setLocalDayItems((current) => {
      const next = [...current]
      const from = next[dragIndex]
      if (!from) return current
      next.splice(dragIndex, 1)
      next.splice(hoverIndex, 0, from)
      return next
    })
  }

  const handleDrop = () => {
    const changed = localDayItems.some((item, i) => item.id !== dayItems[i]?.id)
    if (!changed) return
    reorder.mutate(buildOrders(localDayItems))
  }

  const handleDelete = (itemId: number) => {
    if (typeof window !== 'undefined' && !window.confirm('이 장소를 삭제할까요?')) return
    remove.mutate(itemId)
  }

  const routePreview = preview.data
  const canOptimize = localDayItems.length >= 2
  const disabled = reorder.isPending || remove.isPending || applyOptimized.isPending

  return (
    <section className="flex flex-col gap-6">
      <DayTabs
        startDate={trip.startDate}
        totalDays={totalDays}
        activeDay={activeDay}
        onChange={(day) => {
          setActiveDay(day)
          preview.reset()
        }}
        countsByDay={countsByDay}
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-t600-16 font-semibold text-neutral-900">
          {activeDay}일차 · 장소 {localDayItems.length}개
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outlined-primary"
            size="md"
            onClick={() => preview.mutate(activeDay)}
            disabled={!canOptimize || preview.isPending}
            icon={<Sparkles className="h-4 w-4" />}
          >
            {preview.isPending ? '경로 계산 중…' : '동선 최적화'}
          </Button>
          <Button
            size="md"
            onClick={() => setAddOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            장소 추가
          </Button>
        </div>
      </div>

      {routePreview && routePreview.dayNumber === activeDay && (
        <RoutePreviewCard
          preview={routePreview}
          isApplying={applyOptimized.isPending}
          onDismiss={() => preview.reset()}
          onApply={() =>
            applyOptimized.mutate(activeDay, { onSuccess: () => preview.reset() })
          }
        />
      )}

      {preview.isError && (
        <Alert variant="error">
          {preview.error instanceof ApiRequestError
            ? preview.error.message
            : '경로를 계산하지 못했습니다.'}
        </Alert>
      )}

      {isLoading ? (
        <TimelineSkeleton />
      ) : isError ? (
        <Alert variant="error" title="일정 항목을 불러오지 못했습니다">
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
      ) : localDayItems.length === 0 ? (
        <div className="rounded-card border border-dashed border-neutral-300 bg-neutral-0 p-10 text-center">
          <MapPin className="mx-auto h-10 w-10 text-neutral-400" aria-hidden />
          <p className="mt-3 text-t600-16 font-semibold text-neutral-900">
            아직 등록된 장소가 없습니다
          </p>
          <p className="mt-1 text-l500-14 text-neutral-500">
            {activeDay}일차에 갈 장소를 추가해 보세요.
          </p>
          <Button
            size="lg"
            className="mt-6"
            onClick={() => setAddOpen(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            첫 장소 추가
          </Button>
        </div>
      ) : (
        <DndProvider backend={HTML5Backend}>
          <ol className="flex flex-col gap-3">
            {localDayItems.map((item, index) => (
              <li key={item.id}>
                <DraggableItemRow
                  item={item}
                  index={index}
                  onHover={handleHover}
                  onDrop={handleDrop}
                  onDelete={() => handleDelete(item.id)}
                  disabled={disabled}
                />
              </li>
            ))}
          </ol>
        </DndProvider>
      )}

      <TripItemAddDialog
        tripId={trip.id}
        dayNumber={activeDay}
        nextSortOrder={localDayItems.length}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </section>
  )
}

const TimelineSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="h-20 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50"
      />
    ))}
  </div>
)
