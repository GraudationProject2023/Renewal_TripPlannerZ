'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notificationApi, notificationKeys } from '../../../entities/notification'

const invalidate = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: notificationKeys.lists() })
  queryClient.invalidateQueries({ queryKey: notificationKeys.unread() })
}

/** 알림 1건 읽음 처리. */
export const useMarkRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => notificationApi.markRead(id),
    onSuccess: () => invalidate(queryClient),
  })
}

/** 모든 알림 읽음 처리. */
export const useMarkAllRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => invalidate(queryClient),
  })
}
