'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { tripKeys, tripRouteApi } from '../../../entities/trip'

export const useRoutePreview = (tripId: number) =>
  useMutation({
    mutationFn: (day: number) => tripRouteApi.preview(tripId, day),
  })

export const useApplyOptimizedRoute = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (day: number) => tripRouteApi.applyOptimize(tripId, day),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.items(tripId) })
    },
  })
}
