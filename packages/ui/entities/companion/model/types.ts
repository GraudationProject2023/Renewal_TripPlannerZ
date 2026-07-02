export type CompanionStatus = 'RECRUITING' | 'CLOSED'
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

/** 백엔드 ApplicationResponse와 1:1. */
export interface CompanionApplication {
  id: number
  companionId: number
  applicantId: number
  message: string | null
  status: ApplicationStatus
  createdAt: string
}

/** 백엔드 CompanionSummaryResponse와 1:1. 목록 카드에서 사용. */
export interface CompanionSummary {
  id: number
  hostId: number
  title: string
  destination: string
  startDate: string
  endDate: string
  capacity: number
  status: CompanionStatus
}

/** 백엔드 CompanionResponse와 1:1. */
export interface Companion {
  id: number
  hostId: number
  tripId: number | null
  title: string
  content: string | null
  destination: string
  startDate: string
  endDate: string
  capacity: number
  budget: number | null
  status: CompanionStatus
  createdAt: string
}
