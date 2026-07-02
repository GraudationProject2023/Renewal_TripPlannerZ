'use client'
import { useEffect, useMemo, useRef } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Alert } from '../../../shared/ui'
import { MessageBubble, useChatMessages } from '../../../entities/chat'
import { MemberName, useMe } from '../../../entities/user'
import { ChatComposer } from '../../../features/chat-send'

type ChatRoomViewProps = {
  roomId: number
}

export const ChatRoomView = ({ roomId }: ChatRoomViewProps) => {
  const { data, isLoading, isError, error } = useChatMessages(roomId)
  const { data: me } = useMe()
  const bottomRef = useRef<HTMLDivElement>(null)

  // 서버는 최신순(desc)으로 주므로 오래된→최신으로 뒤집어 표시한다.
  const messages = useMemo(
    () => (data?.content ? [...data.content].reverse() : []),
    [data],
  )

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length])

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={i % 2 === 0 ? 'flex justify-start' : 'flex justify-end'}
              >
                <div className="h-9 w-40 animate-pulse rounded-2xl bg-neutral-100" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <Alert variant="error" title="메시지를 불러오지 못했습니다">
            <p>
              {error instanceof ApiRequestError
                ? error.message
                : '잠시 후 다시 시도해 주세요.'}
            </p>
          </Alert>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-l500-14 text-neutral-400">
              첫 메시지를 보내 대화를 시작하세요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mine={me?.id === message.senderId}
                senderName={<MemberName id={message.senderId} />}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <ChatComposer roomId={roomId} />
    </div>
  )
}
