'use client'
import { clsx } from 'clsx'
import { useMember } from '../model/queries'

type MemberNameProps = {
  id: number
  /** 현재 로그인 사용자 ID. 일치하면 "(나)"를 덧붙인다. */
  meId?: number
  className?: string
}

/** 회원 ID를 닉네임으로 표시한다. 로딩/실패 시 `#id`로 폴백한다. */
export const MemberName = ({ id, meId, className }: MemberNameProps) => {
  const { data } = useMember(id)
  const label = data?.nickname ?? `#${id}`
  return (
    <span className={clsx('inline', className)}>
      {label}
      {meId === id && <span className="ml-1 text-neutral-400">(나)</span>}
    </span>
  )
}
