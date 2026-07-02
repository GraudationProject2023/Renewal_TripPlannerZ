import { differenceInCalendarDays, parseISO } from 'date-fns'

const DATE_FORMATTER = new Intl.DateTimeFormat('ko-KR', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

/** ISO 날짜(YYYY-MM-DD)를 "2026.07.02" 형식으로. */
export const formatIsoDate = (isoDate: string): string =>
  DATE_FORMATTER.format(parseISO(isoDate)).replace(/\.\s?/g, '.').replace(/\.$/, '')

/** startDate ~ endDate 범위를 "2026.07.02 ~ 07.05 · 3박 4일" 형식으로. */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const nights = Math.max(0, differenceInCalendarDays(parseISO(endDate), parseISO(startDate)))
  const days = nights + 1
  return `${formatIsoDate(startDate)} ~ ${formatIsoDate(endDate)} · ${nights}박 ${days}일`
}

/** startDate 기준 dayNumber(1-based)에 해당하는 실제 날짜. */
export const resolveDayDate = (startDate: string, dayNumber: number): Date => {
  const start = parseISO(startDate)
  return new Date(start.getFullYear(), start.getMonth(), start.getDate() + dayNumber - 1)
}

/** 여행 총 일수(포함). start=2026-07-02, end=2026-07-05 → 4. */
export const countRangeDays = (startDate: string, endDate: string): number => {
  const start = parseISO(startDate)
  const end = parseISO(endDate)
  return Math.max(1, differenceInCalendarDays(end, start) + 1)
}

/** 분 단위 체류 시간을 "1시간 30분" 형태로. 0/undefined면 빈 문자열. */
export const formatStayMinutes = (minutes: number | null | undefined): string => {
  if (minutes === null || minutes === undefined || minutes <= 0) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h > 0 && m > 0) return `${h}시간 ${m}분`
  if (h > 0) return `${h}시간`
  return `${m}분`
}

/** 원 단위 금액을 "₩1,234,000" 형태로. null/undefined면 fallback. */
export const formatKrw = (
  amount: number | null | undefined,
  fallback = '미정',
): string => {
  if (amount === null || amount === undefined) return fallback
  return `₩${amount.toLocaleString('ko-KR')}`
}
