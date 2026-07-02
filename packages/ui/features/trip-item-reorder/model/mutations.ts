'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  tripItemApi,
  tripKeys,
  type TripItem,
  type TripItemOrder,
} from '../../../entities/trip'

/**
 * DnD 결과를 백엔드에 반영한다.
 * onMutate에서 캐시를 낙관적으로 갱신하고, 실패 시 롤백한다.
 */
export const useReorderTripItems = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orders: TripItemOrder[]) => tripItemApi.reorder(tripId, orders),
    onMutate: async (orders) => {
      await queryClient.cancelQueries({ queryKey: tripKeys.items(tripId) })
      const previous = queryClient.getQueryData<TripItem[]>(tripKeys.items(tripId))
      if (previous) {
        const orderMap = new Map(orders.map((o) => [o.itemId, o]))
        const next = previous.map((item) => {
          const o = orderMap.get(item.id)
          return o ? { ...item, dayNumber: o.dayNumber, sortOrder: o.sortOrder } : item
        })
        queryClient.setQueryData(tripKeys.items(tripId), next)
      }
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(tripKeys.items(tripId), ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: tripKeys.items(tripId) })
    },
  })
}
