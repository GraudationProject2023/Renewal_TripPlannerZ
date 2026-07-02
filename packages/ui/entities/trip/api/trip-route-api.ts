import { apiGet, apiPost } from '../../../shared/api'
import type { RouteResponse } from '../model/types'

export const tripRouteApi = {
  preview: (tripId: number, day: number) =>
    apiGet<RouteResponse>(`/trips/${tripId}/route?day=${day}`),
  applyOptimize: (tripId: number, day: number) =>
    apiPost<RouteResponse>(`/trips/${tripId}/route/optimize?day=${day}`),
}
