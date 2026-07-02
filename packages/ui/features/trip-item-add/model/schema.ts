import { z } from 'zod'

export const tripItemAddSchema = z.object({
  placeName: z
    .string()
    .min(1, '장소명을 입력하세요.')
    .max(200, '장소명은 200자 이내입니다.'),
  memo: z
    .string()
    .max(500, '메모는 500자 이내입니다.')
    .optional()
    .transform((v) => v?.trim() || null),
  estimatedCost: z
    .number({ invalid_type_error: '숫자를 입력하세요.' })
    .int()
    .min(0)
    .nullable(),
  stayMinutes: z
    .number({ invalid_type_error: '숫자를 입력하세요.' })
    .int()
    .min(0)
    .nullable(),
})

export type TripItemAddInputSchema = z.infer<typeof tripItemAddSchema>
