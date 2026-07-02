'use client'
import { useQuery } from '@tanstack/react-query'
import type { PageParams } from '../../../shared/api'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { chatApi } from '../api/chat-api'

export const chatKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatKeys.all, 'rooms'] as const,
  messages: (roomId: number) =>
    [...chatKeys.all, 'room', roomId, 'messages'] as const,
}

const hasToken = () =>
  typeof window !== 'undefined' && getAccessToken() !== null

/** 내가 참여 중인 채팅방 목록. */
export const useChatRooms = () =>
  useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: chatApi.getRooms,
    enabled: hasToken(),
  })

/**
 * 방의 메시지. STOMP 도입 전까지 폴링으로 실시간을 근사한다.
 * 최신순(desc)으로 받아 화면에서는 오래된→최신 순으로 뒤집어 사용한다.
 */
export const useChatMessages = (roomId: number | undefined, size = 50) =>
  useQuery({
    queryKey:
      roomId !== undefined ? chatKeys.messages(roomId) : chatKeys.all,
    queryFn: () =>
      chatApi.getMessages(roomId as number, {
        page: 0,
        size,
        sort: 'createdAt,desc',
      }),
    enabled: roomId !== undefined && hasToken(),
    refetchInterval: 4000,
  })
