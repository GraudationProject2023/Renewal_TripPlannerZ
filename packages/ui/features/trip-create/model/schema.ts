import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜를 선택하세요.')

export const tripCreateSchema = z
  .object({
    title: z
      .string()
      .min(1, '제목을 입력하세요.')
      .max(100, '제목은 100자 이내입니다.'),
    destination: z
      .string()
      .min(1, '목적지를 입력하세요.')
      .max(100, '목적지는 100자 이내입니다.'),
    startDate: isoDate,
    endDate: isoDate,
    budget: z
      .number({ invalid_type_error: '예산은 숫자입니다.' })
      .int()
      .min(0, '예산은 0원 이상입니다.'),
    visibility: z.enum(['PRIVATE', 'PUBLIC']),
  })
  .refine((v) => v.startDate <= v.endDate, {
    path: ['endDate'],
    message: '종료일은 시작일 이후여야 합니다.',
  })

export type TripCreateInputSchema = z.infer<typeof tripCreateSchema>
