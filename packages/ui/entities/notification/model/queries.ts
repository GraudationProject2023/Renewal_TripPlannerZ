'use client'
import { useQuery } from '@tanstack/react-query'
import type { PageParams } from '../../../shared/api'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { notificationApi } from '../api/notification-api'

export const notificationKeys = {
  all: ['notification'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: PageParams) => [...notificationKeys.lists(), params] as const,
  unread: () => [...notificationKeys.all, 'unread-count'] as const,
}

const hasToken = () =>
  typeof window !== 'undefined' && getAccessToken() !== null

/** 내 알림 목록. 토큰이 있을 때만 조회한다. */
export const useNotifications = (
  params: PageParams = { page: 0, size: 20, sort: 'createdAt,desc' },
) =>
  useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationApi.getMine(params),
    enabled: hasToken(),
  })

/** 안 읽은 알림 수. 헤더 배지 등에서 폴링 용도로 사용한다. */
export const useUnreadCount = () =>
  useQuery({
    queryKey: notificationKeys.unread(),
    queryFn: notificationApi.unreadCount,
    enabled: hasToken(),
  })
