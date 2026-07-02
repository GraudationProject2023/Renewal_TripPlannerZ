import { apiGet } from '../../../shared/api'
import type { BudgetSummary } from '../model/types'

export const budgetApi = {
  summary: (tripId: number) =>
    apiGet<BudgetSummary>(`/trips/${tripId}/budget`),
}
