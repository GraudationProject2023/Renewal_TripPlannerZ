import { apiGet, apiPatch } from '../../../shared/api'
import type { PageEnvelope, PageParams } from '../../../shared/api'
import type { Notification } from '../model/types'

export interface UnreadCount {
  unreadCount: number
}

const buildQuery = (params?: PageParams): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  if (params.sort) search.set('sort', params.sort)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const notificationApi = {
  getMine: (params?: PageParams) =>
    apiGet<PageEnvelope<Notification>>(`/notifications${buildQuery(params)}`),
  unreadCount: () => apiGet<UnreadCount>('/notifications/unread-count'),
  markRead: (id: number) => apiPatch<void>(`/notifications/${id}/read`),
  markAllRead: () => apiPatch<void>('/notifications/read-all'),
}
