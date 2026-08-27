'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
  activeClassName?: string
}

export function NavLink({ href, children, className, activeClassName }: Props) {
  const pathname = usePathname()

  const isActive =
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={[className, isActive && activeClassName].filter(Boolean).join(' ')}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
}