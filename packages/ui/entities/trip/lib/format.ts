import { differenceInCalendarDays, parseISO } from 'date-fns'

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** ISO 날짜(YYYY-MM-DD)를 "2026.07.02" 형식으로. */
export const formatTripDate = (isoDate: string): string => {
  const date = parseISO(isoDate)
  return DATE_FORMATTER.format(date).replace(/\.\s?/g, '.').replace(/\.$/, '')
}

/** startDate ~ endDate 범위를 "2026.07.02 ~ 07.05 (4일)" 형식으로. */
export const formatTripPeriod = (startDate: string, endDate: string): string => {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  const nights = Math.max(0, differenceInCalendarDays(end, start))
  const days = nights + 1
  return `${formatTripDate(startDate)} ~ ${formatTripDate(endDate)} · ${nights}박 ${days}일`
}

export const formatBudget = (budget: number | null | undefined): string => {
  if (budget === null || budget === undefined) return '예산 미정'
  return `₩${budget.toLocaleString('ko-KR')}`
}
