'use client'
import { clsx } from 'clsx'
import type { CompanionListScope } from '../../../entities/companion'

type CompanionScopeTabsProps = {
  value: CompanionListScope
  onChange: (scope: CompanionListScope) => void
}

const TABS: { value: CompanionListScope; label: string; desc: string }[] = [
  { value: 'recruiting', label: '모집중', desc: '지금 참여할 수 있는 동행' },
  { value: 'mine', label: '내 모집', desc: '내가 등록한 모집글' },
]

export const CompanionScopeTabs = ({ value, onChange }: CompanionScopeTabsProps) => (
  <div role="tablist" className="flex gap-2">
    {TABS.map(({ value: v, label }) => (
      <button
        key={v}
        role="tab"
        aria-selected={value === v}
        onClick={() => onChange(v)}
        className={clsx(
          'rounded-lg border px-4 py-2 text-l500-14 transition-colors',
          value === v
            ? 'border-primary-600 bg-primary-50 text-primary-700'
            : 'border-neutral-200 bg-neutral-0 text-neutral-600 hover:border-neutral-300',
        )}
      >
        {label}
      </button>
    ))}
  </div>
)
