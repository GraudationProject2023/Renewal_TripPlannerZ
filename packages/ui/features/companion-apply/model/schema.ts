import { z } from 'zod'

export const applicationCreateSchema = z.object({
  message: z
    .string()
    .max(500, '메시지는 500자 이내입니다.')
    .optional()
    .transform((v) => v?.trim() || null),
})

export type ApplicationCreateInputSchema = z.infer<typeof applicationCreateSchema>
