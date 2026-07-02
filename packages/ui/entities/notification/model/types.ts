/** 백엔드 NotificationType enum과 1:1. */
export type NotificationType =
  | 'COMPANION_APPLICATION_RECEIVED'
  | 'COMPANION_APPLICATION_ACCEPTED'
  | 'COMPANION_APPLICATION_REJECTED'

/** 백엔드 NotificationResponse와 1:1. relatedId는 알림이 가리키는 리소스(예: companionId). */
export interface Notification {
  id: number
  type: NotificationType
  message: string
  relatedId: number | null
  read: boolean
  createdAt: string
}
