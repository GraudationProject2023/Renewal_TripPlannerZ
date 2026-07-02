'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button, FormField, Input } from '../../../shared/ui'
import { useSignup } from '../model/mutations'
import { signupSchema, type SignupInput } from '../model/schema'

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
      <FormField htmlFor="email" label="이메일" error={errors.email?.message}>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={Boolean(errors.email)}
          {...register('email')}
        />
      </FormField>

      <FormField htmlFor="nickname" label="닉네임" error={errors.nickname?.message}>
        <Input
          id="nickname"
          type="text"
          autoComplete="nickname"
          invalid={Boolean(errors.nickname)}
          {...register('nickname')}
        />
      </FormField>

      <FormField htmlFor="password" label="비밀번호" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </FormField>

      {signup.isError && (
        <Alert variant="error">
          {signup.error instanceof ApiRequestError
            ? signup.error.message
            : '회원가입에 실패했습니다.'}
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={signup.isPending} className="w-full">
        {signup.isPending ? '가입 중…' : '회원가입'}
      </Button>
    </form>
  )
}
