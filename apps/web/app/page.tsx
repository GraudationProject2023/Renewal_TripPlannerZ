import { redirect } from 'next/navigation'

// 루트 진입 시 로그인으로 보낸다. (인증/랜딩 라우팅은 추후 확장)
export default function Home() {
  redirect('/login')
}
