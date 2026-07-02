'use client'
import { useQuery } from '@tanstack/react-query'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { userApi } from '../api/user-api'

export const userKeys = {
  all: ['user'] as const,
  me: () => [...userKeys.all, 'me'] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
}

/** 현재 로그인 사용자. 토큰이 있을 때만 조회한다. */
export const useMe = () =>
  useQuery({
    queryKey: userKeys.me(),
    queryFn: userApi.me,
    enabled: typeof window !== 'undefined' && getAccessToken() !== null,
  })

/** 특정 회원 조회. 회원 ID로 닉네임 등을 resolve 한다(정산·지출 표시용). */
export const useMember = (id: number | undefined) =>
  useQuery({
    queryKey: id !== undefined ? userKeys.detail(id) : userKeys.details(),
    queryFn: () => userApi.byId(id as number),
    enabled: id !== undefined,
    staleTime: 5 * 60 * 1000,
  })
