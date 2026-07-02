export type TripVisibility = 'PRIVATE' | 'PUBLIC'

/** 백엔드 TripSummaryResponse와 1:1. 목록 카드에서 사용. */
export interface TripSummary {
  id: number
  title: string
  destination: string
  startDate: string
  endDate: string
  visibility: TripVisibility
}

/** 백엔드 TripResponse와 1:1. 상세 조회에서 사용. */
export interface Trip {
  id: number
  ownerId: number
  title: string
  destination: string
  startDate: string
  endDate: string
  budget: number | null
  visibility: TripVisibility
  createdAt: string
}
