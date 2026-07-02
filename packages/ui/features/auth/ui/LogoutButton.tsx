'use client'
import { LogOut } from 'lucide-react'
import { Button } from '../../../shared/ui'
import { useLogout } from '../model/mutations'

export const LogoutButton = () => {
  const logout = useLogout()
  return (
    <Button
      variant="outlined-secondary"
      size="sm"
      icon={<LogOut className="h-3.5 w-3.5" />}
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
