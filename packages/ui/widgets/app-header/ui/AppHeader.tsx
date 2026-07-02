'use client'
import { useMe } from '../../../entities/user'
import { LogoutButton } from '../../../features/auth'

export const AppHeader = () => {
  const { data: user } = useMe()

  return (
    <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-neutral-0 px-6">
      <a href="/" className="text-t600-18 font-bold text-primary-700">
        ✈️ TripPlannerZ
      </a>
      <div className="flex items-center gap-3">
        {user && (
          <span className="text-l500-14 text-neutral-700">{user.nickname}님</span>
        )}
        <LogoutButton />
      </div>
    </header>
  )
}
