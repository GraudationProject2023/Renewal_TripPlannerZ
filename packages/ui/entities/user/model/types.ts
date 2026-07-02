export type UserRole = 'USER' | 'ADMIN'

/** 백엔드 MemberResponse와 1:1. */
export interface User {
  id: number
  email: string
  nickname: string
  role: UserRole
}
