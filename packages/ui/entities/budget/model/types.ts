/** 백엔드 ExpenseCategory enum과 1:1. */
export type ExpenseCategory =
  | 'FOOD'
  | 'TRANSPORT'
  | 'LODGING'
  | 'ACTIVITY'
  | 'SHOPPING'
  | 'ETC'

/** 백엔드 ExpenseResponse.ShareResponse와 1:1. 멤버별 분담 금액. */
export interface ExpenseShare {
  memberId: number
  shareAmount: number
}

/** 백엔드 ExpenseResponse와 1:1. 지출 1건과 참여자별 분담. */
export interface Expense {
  id: number
  tripId: number
  payerId: number
  amount: number
  category: ExpenseCategory
  description: string | null
  spentOn: string
  shares: ExpenseShare[]
}

/** 백엔드 BudgetSummaryResponse.CategorySpend와 1:1. */
export interface CategorySpend {
  category: ExpenseCategory
  amount: number
}

/** 백엔드 BudgetSummaryResponse와 1:1. 계획 예산 대비 실제 지출 요약. */
export interface BudgetSummary {
  plannedBudget: number | null
  totalSpent: number
  remaining: number | null
  byCategory: CategorySpend[]
}

/** 백엔드 SettlementResponse.MemberBalance와 1:1. net = paid - owed. */
export interface MemberBalance {
  memberId: number
  paid: number
  owed: number
  net: number
}

/** 백엔드 SettlementResponse.Transfer와 1:1. 최소 송금 제안. */
export interface Transfer {
  fromMemberId: number
  toMemberId: number
  amount: number
}

/** 백엔드 SettlementResponse와 1:1. 정산 결과. */
export interface Settlement {
  balances: MemberBalance[]
  transfers: Transfer[]
}
