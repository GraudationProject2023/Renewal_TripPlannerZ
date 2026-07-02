'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripApi, tripKeys, type TripCreateInput } from '../../../entities/trip'

export const useCreateTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TripCreateInput) => tripApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.lists() })
    },
  })
}
