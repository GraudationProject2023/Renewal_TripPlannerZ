'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  budgetKeys,
  expenseApi,
  type ExpenseCreateInput,
} from '../../../entities/budget'

/** 지출 생성. 성공 시 해당 여행의 예산/지출/정산 캐시를 모두 무효화한다. */
export const useCreateExpense = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ExpenseCreateInput) =>
      expenseApi.create(tripId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.trip(tripId) })
    },
  })
}
