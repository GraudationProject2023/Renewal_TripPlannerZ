import { LoginForm } from '../../../features/auth'

export const AuthPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-sm rounded-card bg-neutral-0 p-8 shadow-100">
        <h1 className="mb-1 text-h700-24 font-bold text-primary-700">✈️ TripPlannerZ</h1>
        <p className="mb-6 text-l500-14 text-neutral-500">
          로그인하고 여행을 계획해보세요.
        </p>
        <LoginForm />
        <p className="mt-4 text-center text-l500-12 text-neutral-500">
          아직 계정이 없으신가요?{' '}
          <a href="/signup" className="text-primary-600 underline">
            회원가입
          </a>
        </p>
      </div>
    </main>
  )
}
