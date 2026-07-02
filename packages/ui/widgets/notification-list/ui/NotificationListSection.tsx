'use client'
import { Bell, CheckCheck } from 'lucide-react'
import { useState } from 'react'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button } from '../../../shared/ui'
import {
  NotificationItem,
  notificationHref,
  useNotifications,
  type Notification,
} from '../../../entities/notification'
import { useMarkAllRead, useMarkRead } from '../../../features/notification-read'

const PAGE_SIZE = 20

export const NotificationListSection = () => {
  const [size, setSize] = useState(PAGE_SIZE)
  const { data, isLoading, isError, error, refetch, isFetching } =
    useNotifications({ page: 0, size, sort: 'createdAt,desc' })
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const notifications = data?.content ?? []
  const hasUnread = notifications.some((n) => !n.read)

  const handleClick = (n: Notification) => {
    if (!n.read) markRead.mutate(n.id)
    const href = notificationHref(n)
    if (href) window.location.assign(href)
  }

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-h700-24 font-bold text-neutral-900">알림</h1>
          {data && (
            <p className="mt-1 text-l500-14 text-neutral-500">
              총 {data.totalElements.toLocaleString('ko-KR')}건
            </p>
          )}
        </div>
        <Button
          variant="outlined-secondary"
          size="sm"
          onClick={() => markAllRead.mutate()}
          disabled={!hasUnread || markAllRead.isPending}
          icon={<CheckCheck className="h-4 w-4" />}
        >
          모두 읽음
        </Button>
      </header>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-card border border-neutral-200 bg-neutral-0 shadow-50"
            />
          ))}
        </div>
      ) : isError ? (
        <Alert variant="error" title="알림을 불러오지 못했습니다">
          <p>
            {error instanceof ApiRequestError
              ? error.message
              : '잠시 후 다시 시도해 주세요.'}
          </p>
          <Button
            variant="outlined-secondary"
            size="sm"
            className="mt-3"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? '재시도 중…' : '다시 시도'}
          </Button>
        </Alert>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-neutral-200 py-16 text-center">
          <Bell className="h-9 w-9 text-neutral-300" aria-hidden />
          <p className="text-l500-14 text-neutral-500">새로운 알림이 없어요.</p>
        </div>
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onClick={handleClick}
              />
            ))}
          </ul>
          {data && !data.last && (
            <Button
              variant="ghost"
              onClick={() => setSize((s) => s + PAGE_SIZE)}
              disabled={isFetching}
              className="self-center"
            >
              {isFetching ? '불러오는 중…' : '더 보기'}
            </Button>
          )}
        </>
      )}
    </section>
  )
}
