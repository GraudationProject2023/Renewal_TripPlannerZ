'use client'
import { MessagesSquare } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useChatRooms } from '../../../entities/chat'
import { DashboardShell } from '../../../widgets/dashboard-shell'
import { ChatRoomListPanel } from '../../../widgets/chat-room-list'
import { ChatRoomView } from '../../../widgets/chat-room'

export const ChatPage = () => {
  const { data: rooms } = useChatRooms()
  const [roomId, setRoomId] = useState<number | null>(null)

  useEffect(() => {
    if (roomId === null && rooms && rooms.length > 0) {
      setRoomId(rooms[0]!.roomId)
    }
  }, [rooms, roomId])

  return (
    <DashboardShell>
      <div className="flex flex-col gap-4">
        <h1 className="text-h700-24 font-bold text-neutral-900">채팅</h1>

        <div className="flex h-[calc(100vh-13rem)] overflow-hidden rounded-card border border-neutral-200 bg-neutral-0 shadow-50">
          <div className="w-72 shrink-0 overflow-y-auto border-r border-neutral-200">
            <ChatRoomListPanel
              activeRoomId={roomId}
              onSelect={setRoomId}
            />
          </div>

          <div className="min-w-0 flex-1">
            {roomId !== null ? (
              <ChatRoomView roomId={roomId} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <MessagesSquare className="h-10 w-10 text-neutral-300" aria-hidden />
                <p className="text-l500-14 text-neutral-500">
                  채팅방을 선택하세요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
