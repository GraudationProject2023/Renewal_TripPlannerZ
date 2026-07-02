import { apiGet } from '../../../shared/api'
import type { Settlement } from '../model/types'

export const settlementApi = {
  settle: (tripId: number) =>
    apiGet<Settlement>(`/trips/${tripId}/settlement`),
}
