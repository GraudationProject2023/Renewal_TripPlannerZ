import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상입니다.'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요.'),
  password: z.string().min(8, '비밀번호는 8자 이상입니다.').max(64),
  nickname: z.string().min(2, '닉네임은 2자 이상입니다.').max(20),
})
export type SignupInput = z.infer<typeof signupSchema>
