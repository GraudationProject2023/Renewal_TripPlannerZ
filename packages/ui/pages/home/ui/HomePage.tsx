'use client'
import { useEffect, useState } from 'react'
import { useMe } from '../../../entities/user'
import { getAccessToken } from '../../../shared/lib/utils/api'
import { AppHeader } from '../../../widgets/app-header'

/** 인증 가드: 토큰이 없으면 /login으로 보낸다(클라이언트 사이드). */
export const HomePage = () => {
  const [authed, setAuthed] = useState(false)
  const { data: user } = useMe()

  useEffect(() => {
    if (getAccessToken()) {
      setAuthed(true)
    } else {
      window.location.replace('/login')
    }
  }, [])

  if (!authed) return null

  return (
    <div className="min-h-screen bg-neutral-50">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-h700-24 font-bold text-neutral-900">
          안녕하세요{user ? `, ${user.nickname}님` : ''} 👋
        </h1>
        <p className="mt-2 text-l500-14 text-neutral-500">
          여행 일정을 만들고 동행을 찾아보세요.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="/trips"
            className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-colors hover:border-primary-300"
          >
            <p className="text-t600-16 font-semibold text-neutral-900">🗺️ 내 여행 일정</p>
            <p className="mt-1 text-l500-12 text-neutral-500">일정을 만들고 동선을 정리하세요.</p>
          </a>
          <a
            href="/companions"
            className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-colors hover:border-primary-300"
          >
            <p className="text-t600-16 font-semibold text-neutral-900">🤝 동행 찾기</p>
            <p className="mt-1 text-l500-12 text-neutral-500">함께 갈 사람을 모집·지원하세요.</p>
          </a>
        </div>
      </main>
    </div>
  )
}
