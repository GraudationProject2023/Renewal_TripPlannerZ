'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripItemApi, tripKeys } from '../../../entities/trip'

export const useDeleteTripItem = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemId: number) => tripItemApi.remove(tripId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.items(tripId) })
    },
  })
}
