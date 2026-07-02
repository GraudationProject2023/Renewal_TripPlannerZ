import {
  countRangeDays,
  formatDateRange,
  formatIsoDate,
  formatKrw,
  formatStayMinutes,
  resolveDayDate,
} from '../../../shared/lib'

/** 여행 도메인용 별칭. shared 재노출로 슬라이스 배럴 호환 유지. */
export const formatTripDate = formatIsoDate
export const formatTripPeriod = formatDateRange
export const countTripDays = countRangeDays
export const formatStay = formatStayMinutes
export { resolveDayDate }

export const formatBudget = (budget: number | null | undefined): string =>
  formatKrw(budget, '예산 미정')
