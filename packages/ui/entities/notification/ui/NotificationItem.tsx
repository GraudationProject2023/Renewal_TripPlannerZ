import { clsx } from 'clsx'
import { fromNow, notificationHref, notificationMeta } from '../lib/format'
import type { Notification } from '../model/types'

type NotificationItemProps = {
  notification: Notification
  onClick?: (notification: Notification) => void
}

export const NotificationItem = ({
  notification,
  onClick,
}: NotificationItemProps) => {
  const { icon: Icon, variant } = notificationMeta(notification.type)
  const href = notificationHref(notification)
  const clickable = Boolean(onClick || href)

  const iconTone =
    variant === 'success'
      ? 'bg-success-50 text-success-600'
      : variant === 'error'
        ? 'bg-error-50 text-error-600'
        : 'bg-primary-50 text-primary-600'

  return (
    <li
      onClick={clickable ? () => onClick?.(notification) : undefined}
      className={clsx(
        'flex items-start gap-3 rounded-card border px-4 py-3 transition-colors',
        notification.read
          ? 'border-neutral-200 bg-neutral-0'
          : 'border-primary-100 bg-primary-50/40',
        clickable && 'cursor-pointer hover:bg-neutral-50',
      )}
    >
      <span
        className={clsx(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          iconTone,
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p
          className={clsx(
            'text-l500-14',
            notification.read
              ? 'text-neutral-600'
              : 'font-medium text-neutral-900',
          )}
        >
          {notification.message}
        </p>
        <span className="text-l500-12 text-neutral-400">
          {fromNow(notification.createdAt)}
        </span>
      </div>

      {!notification.read && (
        <span
          className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary-500"
          aria-label="읽지 않음"
        />
      )}
    </li>
  )
}
