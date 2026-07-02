'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { AppHeader } from '../../app-header'
import { AppSidebar } from '../../app-sidebar'

/** GNB(상단) + LNB(좌측) + 콘텐츠 대시보드 레이아웃. 인증 가드 포함. */
export const DashboardShell = ({ children }: { children: ReactNode }) => {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (getAccessToken()) setAuthed(true)
    else window.location.replace('/login')
  }, [])

  if (!authed) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader />
      <div className="flex">
        <AppSidebar />
        <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
