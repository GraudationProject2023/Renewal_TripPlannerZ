'use client'
import { useQuery } from '@tanstack/react-query'
import type { PageParams } from '../../../shared/api'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { companionApi } from '../api/companion-api'
import { companionApplicationApi } from '../api/companion-application-api'

export type CompanionListScope = 'recruiting' | 'mine'

export const companionKeys = {
  all: ['companion'] as const,
  lists: () => [...companionKeys.all, 'list'] as const,
  list: (scope: CompanionListScope, params: PageParams) =>
    [...companionKeys.lists(), scope, params] as const,
  details: () => [...companionKeys.all, 'detail'] as const,
  detail: (id: number) => [...companionKeys.details(), id] as const,
  applications: (id: number) => [...companionKeys.detail(id), 'applications'] as const,
}

const DEFAULT_PARAMS: PageParams = { page: 0, size: 20, sort: 'createdAt,desc' }

export const useRecruitingCompanions = (params: PageParams = DEFAULT_PARAMS) =>
  useQuery({
    queryKey: companionKeys.list('recruiting', params),
    queryFn: () => companionApi.getRecruiting(params),
  })

export const useMyCompanions = (params: PageParams = DEFAULT_PARAMS) =>
  useQuery({
    queryKey: companionKeys.list('mine', params),
    queryFn: () => companionApi.getMine(params),
    enabled: typeof window !== 'undefined' && getAccessToken() !== null,
  })

export const useCompanion = (id: number | undefined) =>
  useQuery({
    queryKey: id !== undefined ? companionKeys.detail(id) : companionKeys.details(),
    queryFn: () => companionApi.getById(id as number),
    enabled: id !== undefined,
  })

/** 호스트만 사용. 지원자 목록. 다른 사용자는 403. */
export const useCompanionApplications = (
  companionId: number | undefined,
  options: { enabled?: boolean } = {},
) =>
  useQuery({
    queryKey:
      companionId !== undefined
        ? companionKeys.applications(companionId)
        : [...companionKeys.all, 'applications'],
    queryFn: () => companionApplicationApi.list(companionId as number),
    enabled: companionId !== undefined && (options.enabled ?? true),
  })
