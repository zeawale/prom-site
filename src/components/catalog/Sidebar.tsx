import Link from 'next/link'
import { getSidebar } from '@/lib/queries'
import { Icon } from '@/components/ui/Icon'
import styles from './Sidebar.module.css'

type Props = { activeSlug?: string }

export async function Sidebar({ activeSlug }: Props) {
  const { flags, categories, total } = await getSidebar()

  const item = (i: Awaited<ReturnType<typeof getSidebar>>['flags'][number]) => (
    <li key={i.slug}>
      <Link
        href={i.href}
        className={`${styles.link} ${activeSlug === i.slug ? styles.active : ''}`}
        aria-current={activeSlug === i.slug ? 'page' : undefined}
      >
        <Icon slug={i.icon} size={20} className={styles.icon} />
        <span>{i.title}</span>
        <span className={styles.count}>{i.count}</span>
      </Link>
    </li>
  )

  return (
    <nav className={styles.sidebar} aria-label="Категории сервисов">
      <ul className={styles.list}>
        <li>
          <Link
            href="/services"
            className={`${styles.link} ${!activeSlug ? styles.active : ''}`}
            aria-current={!activeSlug ? 'page' : undefined}
          >
            <Icon slug="book" size={20} className={styles.icon} />
            <span>Все сервисы</span>
            <span className={styles.count}>{total}</span>
          </Link>
        </li>

        {flags.map(item)}
        {flags.length > 0 && <li className={styles.groupGap} aria-hidden="true" />}
        {categories.map(item)}
      </ul>
    </nav>
  )
}
