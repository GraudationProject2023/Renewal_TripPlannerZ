'use client'
import { clsx } from 'clsx'
import { MessagesSquare } from 'lucide-react'
import { ApiRequestError } from '../../../shared/api'
import { Alert } from '../../../shared/ui'
import { useChatRooms } from '../../../entities/chat'

type ChatRoomListPanelProps = {
  activeRoomId: number | null
  onSelect: (roomId: number) => void
}

export const ChatRoomListPanel = ({
  activeRoomId,
  onSelect,
}: ChatRoomListPanelProps) => {
  const { data: rooms, isLoading, isError, error } = useChatRooms()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-neutral-100"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-3">
        <Alert variant="error" title="채팅방을 불러오지 못했습니다">
          <p>
            {error instanceof ApiRequestError
              ? error.message
              : '잠시 후 다시 시도해 주세요.'}
          </p>
        </Alert>
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 p-8 text-center">
        <MessagesSquare className="h-8 w-8 text-neutral-300" aria-hidden />
        <p className="text-l500-14 text-neutral-500">
          참여 중인 채팅방이 없어요.
        </p>
        <p className="text-l500-12 text-neutral-400">
          동행이 확정되면 채팅방이 열립니다.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-1 p-2">
      {rooms.map((room) => {
        const active = room.roomId === activeRoomId
        return (
          <li key={room.roomId}>
            <button
              type="button"
              onClick={() => onSelect(room.roomId)}
              className={clsx(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                active ? 'bg-primary-50' : 'hover:bg-neutral-100',
              )}
            >
              <span
                className={clsx(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  active
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-neutral-100 text-neutral-400',
                )}
              >
                <MessagesSquare className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex min-w-0 flex-col">
                <span
                  className={clsx(
                    'truncate text-l500-14',
                    active
                      ? 'font-semibold text-primary-700'
                      : 'font-medium text-neutral-800',
                  )}
                >
                  동행 채팅
                </span>
                <span className="truncate text-l500-12 text-neutral-400">
                  동행 #{room.companionId}
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
