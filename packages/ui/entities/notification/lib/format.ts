import {
  Bell,
  CheckCircle2,
  UserPlus,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import type { BadgeProps } from '../../../shared/ui'
import type { Notification, NotificationType } from '../model/types'

type NotificationMeta = {
  label: string
  icon: LucideIcon
  variant: NonNullable<BadgeProps['variant']>
}

const META: Record<NotificationType, NotificationMeta> = {
  COMPANION_APPLICATION_RECEIVED: {
    label: '동행 지원',
    icon: UserPlus,
    variant: 'primary',
  },
  COMPANION_APPLICATION_ACCEPTED: {
    label: '지원 수락',
    icon: CheckCircle2,
    variant: 'success',
  },
  COMPANION_APPLICATION_REJECTED: {
    label: '지원 거절',
    icon: XCircle,
    variant: 'error',
  },
}

const FALLBACK_META: NotificationMeta = {
  label: '알림',
  icon: Bell,
  variant: 'neutral',
}

export const notificationMeta = (type: NotificationType): NotificationMeta =>
  META[type] ?? FALLBACK_META

/** 알림이 가리키는 화면 경로. relatedId가 없으면 null. */
export const notificationHref = (n: Notification): string | null => {
  if (n.relatedId === null) return null
  switch (n.type) {
    case 'COMPANION_APPLICATION_RECEIVED':
    case 'COMPANION_APPLICATION_ACCEPTED':
    case 'COMPANION_APPLICATION_REJECTED':
      return `/companions/${n.relatedId}`
    default:
      return null
  }
}

/** ISO 시각을 상대 시간("3분 전")으로 표시한다. 7일 이상은 날짜로. */
export const fromNow = (iso: string): string => {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diffSec = Math.floor((Date.now() - then) / 1000)
  if (diffSec < 60) return '방금 전'
  const min = Math.floor(diffSec / 60)
  if (min < 60) return `${min}분 전`
  const hour = Math.floor(min / 60)
  if (hour < 24) return `${hour}시간 전`
  const day = Math.floor(hour / 24)
  if (day < 7) return `${day}일 전`
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
