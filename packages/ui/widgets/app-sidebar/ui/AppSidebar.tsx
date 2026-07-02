'use client'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import {
  FiBell,
  FiDollarSign,
  FiHome,
  FiMap,
  FiMessageSquare,
  FiUsers,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'

interface NavItem {
  href: string
  label: string
  icon: IconType
}

const NAV_ITEMS: NavItem[] = [
  { href: '/', label: '홈', icon: FiHome },
  { href: '/trips', label: '여행 일정', icon: FiMap },
  { href: '/companions', label: '동행 찾기', icon: FiUsers },
  { href: '/budget', label: '예산·정산', icon: FiDollarSign },
  { href: '/notifications', label: '알림', icon: FiBell },
  { href: '/chat', label: '채팅', icon: FiMessageSquare },
]

export const AppSidebar = () => {
  const [path, setPath] = useState('/')

  useEffect(() => {
    setPath(window.location.pathname)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? path === '/' : path.startsWith(href)

  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-neutral-200 bg-neutral-0 p-4 md:block">
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <a
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-l500-14 transition-colors',
                active
                  ? 'bg-primary-50 font-semibold text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100',
              )}
            >
              <Icon
                size={18}
                className={active ? 'text-primary-600' : 'text-neutral-400'}
              />
              {label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
