'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  clearAccessToken,
  setAccessToken,
} from '../../../shared/lib/utils/api'
import { userKeys } from '../../../entities/user'
import { authApi } from '../api/auth-api'
import type { LoginInput, SignupInput } from './schema'

const REFRESH_TOKEN_KEY = 'refresh_token'

const persistRefreshToken = (token: string | null) => {
  if (typeof window === 'undefined') return
  if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token)
  else localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (tokens) => {
      setAccessToken(tokens.accessToken)
      persistRefreshToken(tokens.refreshToken)
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
  })
}

export const useSignup = () =>
  useMutation({ mutationFn: (input: SignupInput) => authApi.signup(input) })

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAccessToken()
      persistRefreshToken(null)
      queryClient.clear()
    },
  })
}
