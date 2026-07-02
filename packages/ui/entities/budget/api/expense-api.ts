import { apiDelete, apiGet, apiPost } from '../../../shared/api'
import type { Expense, ExpenseCategory } from '../model/types'

/** 백엔드 ExpenseCreateRequest와 1:1. participantIds 사이에서 amount를 균등 분할(N빵)한다. */
export interface ExpenseCreateInput {
  payerId: number
  amount: number
  category: ExpenseCategory
  description?: string
  spentOn: string
  participantIds: number[]
}

export const expenseApi = {
  list: (tripId: number) => apiGet<Expense[]>(`/trips/${tripId}/expenses`),
  create: (tripId: number, input: ExpenseCreateInput) =>
    apiPost<Expense>(`/trips/${tripId}/expenses`, input),
  remove: (tripId: number, expenseId: number) =>
    apiDelete<void>(`/trips/${tripId}/expenses/${expenseId}`),
}
