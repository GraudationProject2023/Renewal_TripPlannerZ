import { Badge } from '../../../shared/ui'
import { categoryMeta } from '../lib/format'
import type { ExpenseCategory } from '../model/types'

type CategoryBadgeProps = {
  category: ExpenseCategory
  className?: string
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const { label, icon: Icon, variant } = categoryMeta(category)
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  )
}
