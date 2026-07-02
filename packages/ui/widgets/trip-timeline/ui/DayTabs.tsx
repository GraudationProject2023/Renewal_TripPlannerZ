'use client'
import { clsx } from 'clsx'
import { format } from 'date-fns'
import { resolveDayDate } from '../../../entities/trip'

type DayTabsProps = {
  startDate: string
  totalDays: number
  activeDay: number
  onChange: (day: number) => void
  countsByDay: Record<number, number>
}

export const DayTabs = ({
  startDate,
  totalDays,
  activeDay,
  onChange,
  countsByDay,
}: DayTabsProps) => {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1)
  return (
    <div
      role="tablist"
      aria-label="일자 선택"
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {days.map((day) => {
        const date = resolveDayDate(startDate, day)
        const count = countsByDay[day] ?? 0
        const active = day === activeDay
        return (
          <button
            key={day}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(day)}
            className={clsx(
              'group flex min-w-[112px] shrink-0 flex-col items-start rounded-lg border px-3 py-2 text-left transition-all',
              active
                ? 'border-primary-600 bg-primary-50'
                : 'border-neutral-200 bg-neutral-0 hover:border-neutral-300',
            )}
          >
            <span
              className={clsx(
                'text-l500-12',
                active ? 'text-primary-700' : 'text-neutral-500',
              )}
            >
              {format(date, 'MM.dd')}
            </span>
            <span
              className={clsx(
                'mt-0.5 text-t600-16 font-semibold',
                active ? 'text-primary-700' : 'text-neutral-900',
              )}
            >
              {day}일차
            </span>
            <span className="mt-1 text-l500-12 text-neutral-500">
              장소 {count}개
            </span>
          </button>
        )
      })}
    </div>
  )
}
