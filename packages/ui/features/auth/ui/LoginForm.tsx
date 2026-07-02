'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ApiRequestError } from '../../../shared/api'
import { Alert, Button, FormField, Input } from '../../../shared/ui'
import { useLogin } from '../model/mutations'
import { loginSchema, type LoginInput } from '../model/schema'

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  const login = useLogin()

  return (
    <form
      onSubmit={handleSubmit((values) =>
        login.mutate(values, { onSuccess: () => window.location.assign('/') }),
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

      <FormField htmlFor="password" label="비밀번호" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          invalid={Boolean(errors.password)}
          {...register('password')}
        />
      </FormField>

      {login.isError && (
        <Alert variant="error">
          {login.error instanceof ApiRequestError
            ? login.error.message
            : '로그인에 실패했습니다.'}
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={login.isPending} className="w-full">
        {login.isPending ? '로그인 중…' : '로그인'}
      </Button>
    </form>
  )
}
