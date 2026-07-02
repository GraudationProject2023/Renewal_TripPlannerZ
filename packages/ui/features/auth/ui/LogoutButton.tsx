'use client'
import { Button } from '../../../shared/ui'
import { useLogout } from '../model/mutations'

export const LogoutButton = () => {
  const logout = useLogout()
  return (
    <Button
      variant="outlined-secondary"
      size="sm"
      disabled={logout.isPending}
      onClick={() =>
        logout.mutate(undefined, {
          onSettled: () => window.location.assign('/login'),
        })
      }
    >
      로그아웃
    </Button>
  )
}
