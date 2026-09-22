'use client'

import { useId, useState, type FocusEvent } from 'react'
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
 * На телефоне семь пилюль в три ряда — пол-экрана кнопок, поэтому там
 * вместо них выпадашка «Программа: 1С:Бухгалтерия ▾». Тот же паттерн, что
 * у категорий каталога. Какой из двух вариантов виден, решает CSS.
 *
 * Выпадашка своя, а не <details>, в отличие от каталога: компонент живёт
 * в layout раздела, а layout при переходе между программами НЕ
 * монтируется заново. Открытый <details> так и остался бы открытым на
 * новой странице. Здесь список закрывается кликом по пункту.
 */
export default function ProgramTabs({ tabs }: { tabs: ProgramTab[] }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelId = useId()

  // Точное сравнение: у программ нет вложенных страниц,
  // startsWith тут только создал бы ложные срабатывания
  const isActive = (slug: string) => pathname === `/programs/${slug}`
  const current = tabs.find(({ slug }) => isActive(slug))

  const links = (className: string) =>
    tabs.map(({ slug, label }) => {
      const active = isActive(slug)
      return (
        <li key={slug}>
          <Link
            href={`/programs/${slug}`}
            className={className}
            data-active={active || undefined}
            // Без атрибута незрячий пользователь не поймёт,
            // на какой из семи вкладок находится
            aria-current={active ? 'page' : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </Link>
        </li>
      )
    })

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null
    if (!next || !event.currentTarget.contains(next)) setOpen(false)
  }

  return (
    <>
      <nav className={styles.nav} aria-label="Программы 1С">
        <ul className={styles.list}>{links(styles.tab)}</ul>
      </nav>

      <div className={styles.dropdown} onBlur={onBlur}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.toggleLabel}>Программа</span>
          <span className={styles.toggleValue}>{current?.label ?? 'Выберите'}</span>
          <span className={styles.chevron} data-open={open || undefined} aria-hidden="true" />
        </button>

        {open && (
          <nav id={panelId} className={styles.panel} aria-label="Программы 1С">
            <ul className={styles.panelList}>{links(styles.option)}</ul>
          </nav>
        )}
      </div>
    </>
  )
}
