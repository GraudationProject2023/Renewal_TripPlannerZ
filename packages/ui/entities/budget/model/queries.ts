'use client'
import { useQuery } from '@tanstack/react-query'
import { budgetApi } from '../api/budget-api'
import { expenseApi } from '../api/expense-api'
import { settlementApi } from '../api/settlement-api'

export const budgetKeys = {
  all: ['budget'] as const,
  trip: (tripId: number) => [...budgetKeys.all, tripId] as const,
  summary: (tripId: number) => [...budgetKeys.trip(tripId), 'summary'] as const,
  expenses: (tripId: number) => [...budgetKeys.trip(tripId), 'expenses'] as const,
  settlement: (tripId: number) =>
    [...budgetKeys.trip(tripId), 'settlement'] as const,
}

export const useBudgetSummary = (tripId: number | undefined) =>
  useQuery({
    queryKey:
      tripId !== undefined ? budgetKeys.summary(tripId) : budgetKeys.all,
    queryFn: () => budgetApi.summary(tripId as number),
    enabled: tripId !== undefined,
  })

export const useExpenses = (tripId: number | undefined) =>
  useQuery({
    queryKey:
      tripId !== undefined ? budgetKeys.expenses(tripId) : budgetKeys.all,
    queryFn: () => expenseApi.list(tripId as number),
    enabled: tripId !== undefined,
  })

export const useSettlement = (tripId: number | undefined) =>
  useQuery({
    queryKey:
      tripId !== undefined ? budgetKeys.settlement(tripId) : budgetKeys.all,
    queryFn: () => settlementApi.settle(tripId as number),
    enabled: tripId !== undefined,
  })
