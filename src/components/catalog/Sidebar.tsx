import Link from 'next/link'
import { getSidebar, type SidebarItem } from '@/lib/queries'
import { Icon } from '@/components/ui/Icon'
import styles from './Sidebar.module.css'

type Props = { activeSlug?: string }

type Item = SidebarItem

/**
 * Категории каталога. Один и тот же список рендерится дважды: колонкой
 * слева на десктопе и выпадашкой над поиском на телефоне. Какой из двух
 * виден, решает CSS — второй экземпляр под display: none и в дерево
 * доступности не попадает.
 *
 * Выпадашка — <details>, а не клиентский компонент: компонент остаётся
 * серверным, данные у него те же, и открыть-закрыть список можно без
 * JavaScript. Переход по ссылке уводит на другую страницу каталога,
 * там сайдбар монтируется заново — и список снова свёрнут.
 */
export async function Sidebar({ activeSlug }: Props) {
  const { flags, categories, total } = await getSidebar()

  const all: Item = {
    slug: '',
    title: 'Все сервисы',
    href: '/services',
    icon: 'book',
    count: total,
  }

  const isActive = (i: Item) => (i.slug ? activeSlug === i.slug : !activeSlug)
  const current = [all, ...flags, ...categories].find(isActive) ?? all

  const item = (i: Item) => (
    <li key={i.slug || 'all'}>
      <Link
        href={i.href}
        className={`${styles.link} ${isActive(i) ? styles.active : ''}`}
        aria-current={isActive(i) ? 'page' : undefined}
      >
        <Icon slug={i.icon} size={20} className={styles.icon} />
        <span>{i.title}</span>
        <span className={styles.count}>{i.count}</span>
      </Link>
    </li>
  )

  const list = (
    <ul className={styles.list}>
      {item(all)}
      {flags.map(item)}
      {flags.length > 0 && <li className={styles.groupGap} aria-hidden="true" />}
      {categories.map(item)}
    </ul>
  )

  return (
    <>
      <nav className={styles.sidebar} aria-label="Категории сервисов">
        {list}
      </nav>

      <details className={styles.dropdown}>
        <summary className={styles.summary}>
          <span className={styles.summaryLabel}>Категория</span>
          <span className={styles.summaryValue}>{current.title}</span>
          <span className={styles.count}>{current.count}</span>
          <span className={styles.chevron} aria-hidden="true" />
        </summary>
        <nav className={styles.dropdownPanel} aria-label="Категории сервисов">
          {list}
        </nav>
      </details>
    </>
  )
}
