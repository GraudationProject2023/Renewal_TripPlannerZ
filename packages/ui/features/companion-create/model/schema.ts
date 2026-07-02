import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜를 선택하세요.')

export const companionCreateSchema = z
  .object({
    title: z.string().min(1, '제목을 입력하세요.').max(100),
    content: z.string().max(2000, '본문은 2000자 이내입니다.').optional().transform((v) => v?.trim() || null),
    destination: z.string().min(1, '목적지를 입력하세요.').max(100),
    startDate: isoDate,
    endDate: isoDate,
    capacity: z.number().int().min(2, '2명 이상만 가능합니다.'),
    budget: z.number().int().min(0).nullable(),
    tripId: z.number().int().positive().nullable(),
  })
  .refine((v) => v.startDate <= v.endDate, {
    path: ['endDate'],
    message: '종료일은 시작일 이후여야 합니다.',
  })

export type CompanionCreateInputSchema = z.infer<typeof companionCreateSchema>
