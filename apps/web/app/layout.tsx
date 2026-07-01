import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TripPlannerZ',
  description: '여행 일정 관리 · 예산 설계 · 동행자 매칭 플랫폼',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
