import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import type { ChatMessage } from '../model/types'

type MessageBubbleProps = {
  message: ChatMessage
  mine: boolean
  /** 상대 메시지의 발신자 표시. 위젯이 회원 이름을 주입한다. */
  senderName?: ReactNode
}

const formatTime = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const MessageBubble = ({
  message,
  mine,
  senderName,
}: MessageBubbleProps) => (
  <div className={clsx('flex flex-col gap-1', mine ? 'items-end' : 'items-start')}>
    {!mine && senderName && (
      <span className="px-1 text-l500-12 text-neutral-500">{senderName}</span>
    )}
    <div
      className={clsx(
        'flex items-end gap-1.5',
        mine ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <p
        className={clsx(
          'max-w-[70%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2 text-l500-14',
          mine
            ? 'rounded-br-sm bg-primary-600 text-white'
            : 'rounded-bl-sm bg-neutral-100 text-neutral-800',
        )}
      >
        {message.content}
      </p>
      <span className="shrink-0 text-l500-12 text-neutral-400">
        {formatTime(message.createdAt)}
      </span>
    </div>
  </div>
)
