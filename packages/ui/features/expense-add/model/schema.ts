import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜를 선택하세요.')

export const expenseAddSchema = z.object({
  payerId: z
    .number({ invalid_type_error: '결제자를 선택하세요.' })
    .int()
    .positive('결제자를 선택하세요.'),
  amount: z
    .number({ invalid_type_error: '금액은 숫자입니다.' })
    .int('금액은 정수입니다.')
    .positive('금액을 입력하세요.'),
  category: z.enum([
    'FOOD',
    'TRANSPORT',
    'LODGING',
    'ACTIVITY',
    'SHOPPING',
    'ETC',
  ]),
  description: z
    .string()
    .max(200, '설명은 200자 이내입니다.')
    .optional(),
  spentOn: isoDate,
  participantIds: z
    .array(z.number().int().positive())
    .min(1, '분담할 참여자를 한 명 이상 선택하세요.'),
})

export type ExpenseAddSchema = z.infer<typeof expenseAddSchema>
