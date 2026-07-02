'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { chatApi, chatKeys } from '../../../entities/chat'

/** 메시지 전송. 성공 시 방 메시지 캐시를 무효화한다(서버가 브로드캐스트도 수행). */
export const useSendMessage = (roomId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (content: string) => chatApi.send(roomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(roomId) })
    },
  })
}
