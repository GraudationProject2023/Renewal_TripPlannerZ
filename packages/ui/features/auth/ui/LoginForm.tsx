'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useLogin } from '../model/mutations'
import { loginSchema, type LoginInput } from '../model/schema'

const fieldClass =
  'rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none focus:border-primary-600'

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const login = useLogin()

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="flex w-full flex-col gap-4"
    >
      <div className="flex flex-col gap-1">
        <label className="text-l500-14 text-neutral-700" htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          {...register('email')}
        />
        {errors.email && (
          <p className="text-l500-12 text-error-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-l500-14 text-neutral-700" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={fieldClass}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-l500-12 text-error-600">{errors.password.message}</p>
        )}
      </div>

      {login.isError && (
        <p className="text-l500-12 text-error-600">
          {login.error instanceof ApiRequestError
            ? login.error.message
            : '로그인에 실패했습니다.'}
        </p>
      )}

      <Button type="submit" size="lg" disabled={login.isPending} className="w-full">
        {login.isPending ? '로그인 중…' : '로그인'}
      </Button>
    </form>
  )
}
