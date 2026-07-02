'use client'
import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { userApi } from '../api/user-api'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
}

/** 현재 로그인 사용자. 토큰이 있을 때만 조회한다. */
export const useMe = () =>
  useQuery({
    queryKey: userKeys.me(),
    queryFn: userApi.me,
    enabled: typeof window !== 'undefined' && getAccessToken() !== null,
  })
