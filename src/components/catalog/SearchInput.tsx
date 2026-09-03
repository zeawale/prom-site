'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './SearchInput.module.css'

export function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get('q') ?? '')

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      if (value) params.set('q', value)
      else params.delete('q')

      const query = params.toString()
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }, 300)

    return () => clearTimeout(timer)
  }, [value, pathname, router, searchParams])

  return (
    <div className={styles.wrap}>
      <input
        type="search"
        className={styles.input}
        placeholder="Поиск по сервисам"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Поиск по каталогу сервисов"
      />
    </div>
  )
}
