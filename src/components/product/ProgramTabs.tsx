'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './ProgramTabs.module.css'

export type ProgramTab = {
  slug: string
  label: string
}

/**
 * Выглядит как табы, работает как навигация: каждая вкладка — отдельная
 * страница с собственным URL. Нужно для SEO и прямых ссылок.
 *
 * Клиентский только ради usePathname. Ссылки статичные, состояния нет.
 */
export default function ProgramTabs({ tabs }: { tabs: ProgramTab[] }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Программы 1С">
      <ul className={styles.list}>
        {tabs.map(({ slug, label }) => {
          const href = `/programs/${slug}`
          // Точное сравнение: у программ нет вложенных страниц,
          // startsWith тут только создал бы ложные срабатывания
          const active = pathname === href

          return (
            <li key={slug}>
              <Link
                href={href}
                className={styles.tab}
                data-active={active || undefined}
                // Без атрибута незрячий пользователь не поймёт,
                // на какой из семи вкладок находится
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}