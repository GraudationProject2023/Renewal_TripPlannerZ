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

/** 백엔드 TripItemResponse와 1:1. 일정 안의 개별 장소. */
export interface TripItem {
  id: number
  dayNumber: number
  sortOrder: number
  placeName: string
  memo: string | null
  estimatedCost: number | null
  stayMinutes: number | null
  latitude: number | null
  longitude: number | null
}

/** 백엔드 RouteResponse와 1:1. 하루 최적 경로 결과. */
export interface RouteResponse {
  dayNumber: number
  totalDistanceKm: number
  stops: RouteStop[]
}

export interface RouteStop {
  itemId: number
  placeName: string
  latitude: number
  longitude: number
}

/** 백엔드 TripItemReorderRequest.ItemOrder와 1:1. */
export interface TripItemOrder {
  itemId: number
  dayNumber: number
  sortOrder: number
}
