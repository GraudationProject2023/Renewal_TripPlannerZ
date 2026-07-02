import { apiGet, apiPatch, apiPost, apiPut } from '../../../shared/api'
import type { PageEnvelope, PageParams } from '../../../shared/api'
import type { Companion, CompanionSummary } from '../model/types'

export interface CompanionCreateInput {
  title: string
  content?: string | null
  destination: string
  startDate: string
  endDate: string
  capacity: number
  budget?: number | null
  tripId?: number | null
}

export type CompanionUpdateInput = CompanionCreateInput

const buildQuery = (params?: PageParams): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  if (params.sort) search.set('sort', params.sort)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const companionApi = {
  getRecruiting: (params?: PageParams) =>
    apiGet<PageEnvelope<CompanionSummary>>(`/companions${buildQuery(params)}`),
  getMine: (params?: PageParams) =>
    apiGet<PageEnvelope<CompanionSummary>>(`/companions/mine${buildQuery(params)}`),
  getById: (id: number) => apiGet<Companion>(`/companions/${id}`),
  create: (input: CompanionCreateInput) => apiPost<Companion>('/companions', input),
  update: (id: number, input: CompanionUpdateInput) =>
    apiPut<Companion>(`/companions/${id}`, input),
  close: (id: number) => apiPatch<void>(`/companions/${id}/close`),
}
