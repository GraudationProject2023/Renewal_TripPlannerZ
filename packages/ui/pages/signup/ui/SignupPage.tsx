import { SignupForm } from '../../../features/auth'

export const SignupPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-primary-50 px-4">
      <div className="w-full max-w-sm rounded-card bg-neutral-0 p-8 shadow-100">
        <h1 className="mb-1 text-h700-24 font-bold text-primary-700">회원가입</h1>
        <p className="mb-6 text-l500-14 text-neutral-500">
          TripPlannerZ 계정을 만드세요.
        </p>
        <SignupForm />
        <p className="mt-4 text-center text-l500-12 text-neutral-500">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-primary-600 underline">
            로그인
          </a>
        </p>
      </div>
    </main>
  )
}
