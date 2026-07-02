'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Button } from '../../../shared/ui'
import { useSignup } from '../model/mutations'
import { signupSchema, type SignupInput } from '../model/schema'

const fieldClass =
  'rounded-lg border border-neutral-300 px-3 py-2 text-l500-14 outline-none focus:border-primary-600'

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })
  const signup = useSignup()

  return (
    <form
      onSubmit={handleSubmit((values) =>
        signup.mutate(values, { onSuccess: () => window.location.assign('/login') }),
      )}
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
        <label className="text-l500-14 text-neutral-700" htmlFor="nickname">
          닉네임
        </label>
        <input
          id="nickname"
          type="text"
          autoComplete="nickname"
          className={fieldClass}
          {...register('nickname')}
        />
        {errors.nickname && (
          <p className="text-l500-12 text-error-600">{errors.nickname.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-l500-14 text-neutral-700" htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={fieldClass}
          {...register('password')}
        />
        {errors.password && (
          <p className="text-l500-12 text-error-600">{errors.password.message}</p>
        )}
      </div>

      {signup.isError && (
        <p className="text-l500-12 text-error-600">
          {signup.error instanceof ApiRequestError
            ? signup.error.message
            : '회원가입에 실패했습니다.'}
        </p>
      )}

      <Button type="submit" size="lg" disabled={signup.isPending} className="w-full">
        {signup.isPending ? '가입 중…' : '회원가입'}
      </Button>
    </form>
  )
}
