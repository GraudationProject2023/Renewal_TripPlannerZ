'use client'
import { cn } from '../../../shared/ui'
import type { CompanionListScope } from '../../../entities/companion'

type CompanionScopeTabsProps = {
  value: CompanionListScope
  onChange: (scope: CompanionListScope) => void
}

const TABS: { value: CompanionListScope; label: string }[] = [
  { value: 'recruiting', label: '모집중' },
  { value: 'mine', label: '내 모집' },
]

export const CompanionScopeTabs = ({ value, onChange }: CompanionScopeTabsProps) => (
  <div role="tablist" className="flex gap-2">
    {TABS.map(({ value: v, label }) => (
      <button
        key={v}
        role="tab"
        aria-selected={value === v}
        onClick={() => onChange(v)}
        className={cn(
          'rounded-lg border px-4 py-2 text-l500-14 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400',
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
