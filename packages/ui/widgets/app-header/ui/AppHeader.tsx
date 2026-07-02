'use client'
import { FiBell } from 'react-icons/fi'
import { useMe } from '../../../entities/user'
import { LogoutButton } from '../../../features/auth'

export const AppHeader = () => {
  const { data: user } = useMe()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 bg-neutral-0 px-6">
      <a href="/" className="flex items-center gap-2 text-t600-18 font-bold text-primary-700">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-600 text-neutral-0">
          ✈️
        </span>
        TripPlannerZ
      </a>

      <div className="flex items-center gap-3">
        <a
          href="/notifications"
          aria-label="알림"
          className="grid h-9 w-9 place-items-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100"
        >
          <FiBell size={18} />
        </a>
        <div className="flex items-center gap-2 pl-1">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-l500-14 font-semibold text-primary-700">
            {user?.nickname?.[0] ?? 'U'}
          </span>
          <span className="hidden text-l500-14 text-neutral-700 sm:inline">
            {user?.nickname ?? ''}
          </span>
        </div>
        <LogoutButton />
      </div>
    </header>
  )
}
