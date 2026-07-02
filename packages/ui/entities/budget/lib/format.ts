import {
  BedDouble,
  Bus,
  MoreHorizontal,
  ShoppingBag,
  Ticket,
  Utensils,
  type LucideIcon,
} from 'lucide-react'
import { formatKrw } from '../../../shared/lib'
import type { BadgeProps } from '../../../shared/ui'
import type { ExpenseCategory } from '../model/types'

export type CategoryMeta = {
  value: ExpenseCategory
  label: string
  icon: LucideIcon
  variant: NonNullable<BadgeProps['variant']>
}

/** 지출 카테고리 메타. 선택/표시 순서 유지를 위해 배열로 관리한다. */
export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  { value: 'FOOD', label: '식비', icon: Utensils, variant: 'warning' },
  { value: 'TRANSPORT', label: '교통', icon: Bus, variant: 'primary' },
  { value: 'LODGING', label: '숙박', icon: BedDouble, variant: 'success' },
  { value: 'ACTIVITY', label: '액티비티', icon: Ticket, variant: 'primary' },
  { value: 'SHOPPING', label: '쇼핑', icon: ShoppingBag, variant: 'error' },
  { value: 'ETC', label: '기타', icon: MoreHorizontal, variant: 'neutral' },
]

const CATEGORY_MAP = new Map(EXPENSE_CATEGORIES.map((c) => [c.value, c]))

export const categoryMeta = (category: ExpenseCategory): CategoryMeta =>
  CATEGORY_MAP.get(category) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]!

export const categoryLabel = (category: ExpenseCategory): string =>
  categoryMeta(category).label

/** 정산/지출 금액 표시. 0원도 명시적으로 노출한다. */
export const formatMoney = (amount: number | null | undefined): string =>
  formatKrw(amount, '미정')
