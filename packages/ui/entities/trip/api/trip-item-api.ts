import { apiDelete, apiGet, apiPost, apiPut } from '../../../shared/api'
import type { TripItem, TripItemOrder } from '../model/types'

export interface TripItemInput {
  dayNumber: number
  sortOrder: number
  placeName: string
  memo?: string | null
  estimatedCost?: number | null
  stayMinutes?: number | null
  latitude?: number | null
  longitude?: number | null
}

export const tripItemApi = {
  list: (tripId: number) => apiGet<TripItem[]>(`/trips/${tripId}/items`),
  add: (tripId: number, input: TripItemInput) =>
    apiPost<TripItem>(`/trips/${tripId}/items`, input),
  reorder: (tripId: number, orders: TripItemOrder[]) =>
    apiPut<void>(`/trips/${tripId}/items/reorder`, { orders }),
  remove: (tripId: number, itemId: number) =>
    apiDelete<void>(`/trips/${tripId}/items/${itemId}`),
}
