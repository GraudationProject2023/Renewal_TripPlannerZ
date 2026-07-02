import { apiGet, apiPost } from '../../../shared/api'
import type { PageEnvelope, PageParams } from '../../../shared/api'
import type { ChatMessage, ChatRoom } from '../model/types'

const buildQuery = (params?: PageParams): string => {
  if (!params) return ''
  const search = new URLSearchParams()
  if (params.page !== undefined) search.set('page', String(params.page))
  if (params.size !== undefined) search.set('size', String(params.size))
  if (params.sort) search.set('sort', params.sort)
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const chatApi = {
  getRooms: () => apiGet<ChatRoom[]>('/chat/rooms'),
  getMessages: (roomId: number, params?: PageParams) =>
    apiGet<PageEnvelope<ChatMessage>>(
      `/chat/rooms/${roomId}/messages${buildQuery(params)}`,
    ),
  send: (roomId: number, content: string) =>
    apiPost<ChatMessage>(`/chat/rooms/${roomId}/messages`, { content }),
}
