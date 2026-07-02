'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  tripItemApi,
  tripKeys,
  type TripItemInput,
} from '../../../entities/trip'

export const useAddTripItem = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TripItemInput) => tripItemApi.add(tripId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.items(tripId) })
    },
  })
}
