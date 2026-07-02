'use client'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { Button, Textarea } from '../../../shared/ui'
import { useSendMessage } from '../model/mutations'

type ChatComposerProps = {
  roomId: number
}

export const ChatComposer = ({ roomId }: ChatComposerProps) => {
  const [value, setValue] = useState('')
  const sendMessage = useSendMessage(roomId)

  const submit = () => {
    const content = value.trim()
    if (!content || sendMessage.isPending) return
    sendMessage.mutate(content, { onSuccess: () => setValue('') })
  }

  return (
    <div className="flex items-end gap-2 border-t border-neutral-200 bg-neutral-0 p-3">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            submit()
          }
        }}
        rows={1}
        placeholder="메시지를 입력하세요 (Enter 전송, Shift+Enter 줄바꿈)"
        className="max-h-32 min-h-[42px] flex-1 resize-none"
      />
      <Button
        onClick={submit}
        disabled={!value.trim() || sendMessage.isPending}
        icon={<Send className="h-4 w-4" />}
        aria-label="전송"
      >
        전송
      </Button>
    </div>
  )
}
