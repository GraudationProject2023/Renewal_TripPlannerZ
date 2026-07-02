'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { budgetKeys, expenseApi } from '../../../entities/budget'

/** 지출 삭제. 성공 시 해당 여행의 예산/지출/정산 캐시를 모두 무효화한다. */
export const useDeleteExpense = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (expenseId: number) => expenseApi.remove(tripId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.trip(tripId) })
    },
  })
}
