export interface ValidationError {
  detail: {
    loc: [string, number]
    msg: string
    type: string
  }[]
}

/** 백엔드 표준 응답 래퍼. code는 프론트와의 계약 문자열. */
export interface ApiError {
  code: string
  message: string
}

export interface ApiEnvelope<T> {
  success: boolean
  data: T
  error: ApiError | null
}

/** 백엔드 PageResponse<T>와 1:1. */
export interface PageEnvelope<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/** 페이지네이션 요청 파라미터(Spring Pageable). */
export interface PageParams {
  page?: number
  size?: number
  sort?: string
}
