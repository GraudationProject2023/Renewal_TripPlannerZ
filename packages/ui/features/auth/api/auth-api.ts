import { apiPost } from '../../../shared/api'
import type { User } from '../../../entities/user'
import type { LoginInput, SignupInput } from '../model/schema'

/** 백엔드 TokenResponse와 1:1. */
export interface TokenResponse {
  accessToken: string
  refreshToken: string
}

export const authApi = {
  signup: (input: SignupInput) => apiPost<User>('/members', input),
  login: (input: LoginInput) => apiPost<TokenResponse>('/auth/login', input),
  reissue: (refreshToken: string) =>
    apiPost<TokenResponse>('/auth/reissue', { refreshToken }),
  logout: () => apiPost<void>('/auth/logout'),
}
