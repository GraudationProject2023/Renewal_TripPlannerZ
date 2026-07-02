import { apiGet } from '../../../shared/api'
import type { User } from '../model/types'

export const userApi = {
  me: () => apiGet<User>('/members/me'),
  byId: (id: number) => apiGet<User>(`/members/${id}`),
}
