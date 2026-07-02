import { apiDelete, apiGet, apiPost, apiPut } from '../../../shared/api'
import type { PageEnvelope, PageParams } from '../../../shared/api'
import type { Trip, TripSummary, TripVisibility } from '../model/types'

export interface TripCreateInput {
  title: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  visibility: TripVisibility
}

export type TripUpdateInput = TripCreateInput

const buildQuery = (params?: PageParams): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  if (params.sort) search.set('sort', params.sort)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const tripApi = {
  getMine: (params?: PageParams) =>
    apiGet<PageEnvelope<TripSummary>>(`/trips${buildQuery(params)}`),
  getById: (id: number) => apiGet<Trip>(`/trips/${id}`),
  create: (input: TripCreateInput) => apiPost<Trip>('/trips', input),
  update: (id: number, input: TripUpdateInput) =>
    apiPut<Trip>(`/trips/${id}`, input),
  remove: (id: number) => apiDelete<void>(`/trips/${id}`),
}
