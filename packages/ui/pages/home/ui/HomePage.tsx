'use client'
import { useMe } from '../../../entities/user'
import { DashboardShell } from '../../../widgets/dashboard-shell'

interface QuickLink {
  href: string
  emoji: string
  title: string
  desc: string
}

const QUICK_LINKS: QuickLink[] = [
  { href: '/trips', emoji: '🗺️', title: '여행 일정', desc: '일정을 만들고 동선을 정리하세요.' },
  { href: '/companions', emoji: '🤝', title: '동행 찾기', desc: '함께 갈 사람을 모집·지원하세요.' },
  { href: '/budget', emoji: '💸', title: '예산·정산', desc: '지출을 기록하고 N빵 정산하세요.' },
]

export const HomePage = () => {
  const { data: user } = useMe()

  return (
    <DashboardShell>
      <h1 className="text-h700-24 font-bold text-neutral-900">
        안녕하세요{user ? `, ${user.nickname}님` : ''} 👋
      </h1>
      <p className="mt-2 text-l500-14 text-neutral-500">
        여행 일정을 만들고 동행을 찾아보세요.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_LINKS.map(({ href, emoji, title, desc }) => (
          <a
            key={href}
            href={href}
            className="rounded-card border border-neutral-200 bg-neutral-0 p-5 shadow-50 transition-colors hover:border-primary-300"
          >
            <p className="text-t600-16 font-semibold text-neutral-900">
              {emoji} {title}
            </p>
            <p className="mt-1 text-l500-12 text-neutral-500">{desc}</p>
          </a>
        ))}
      </div>
    </DashboardShell>
  )
}
