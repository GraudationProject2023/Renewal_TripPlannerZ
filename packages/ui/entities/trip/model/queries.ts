'use client'
import { useQuery } from '@tanstack/react-query'
import type { PageParams } from '../../../shared/api'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { tripApi } from '../api/trip-api'
import { tripItemApi } from '../api/trip-item-api'

export const tripKeys = {
  all: ['trip'] as const,
  lists: () => [...tripKeys.all, 'list'] as const,
  list: (params: PageParams) => [...tripKeys.lists(), params] as const,
  details: () => [...tripKeys.all, 'detail'] as const,
  detail: (id: number) => [...tripKeys.details(), id] as const,
  items: (id: number) => [...tripKeys.detail(id), 'items'] as const,
}

/** 내 여행 목록. 토큰이 있을 때만 조회한다. */
export const useMyTrips = (params: PageParams = { page: 0, size: 20, sort: 'startDate,desc' }) =>
  useQuery({
    queryKey: tripKeys.list(params),
    queryFn: () => tripApi.getMine(params),
    enabled: typeof window !== 'undefined' && getAccessToken() !== null,
  })

export const useTrip = (id: number | undefined) =>
  useQuery({
    queryKey: id !== undefined ? tripKeys.detail(id) : tripKeys.details(),
    queryFn: () => tripApi.getById(id as number),
    enabled: id !== undefined,
  })

export const useTripItems = (tripId: number | undefined) =>
  useQuery({
    queryKey: tripId !== undefined ? tripKeys.items(tripId) : ['trip', 'items'],
    queryFn: () => tripItemApi.list(tripId as number),
    enabled: tripId !== undefined,
  })
