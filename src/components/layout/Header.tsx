import Image from 'next/image'
import Link from 'next/link'
import { mainNav } from '@/lib/navigation'
import { NavLink } from './NavLink'
import { RequestButton } from './RequestButton'
import styles from './Header.module.css'

/**
 * Шапка ничего не запрашивает: телефон отсюда убран (восемь пунктов меню
 * и номер в строку не помещались), а больше данных из Settings ей не нужно.
 * Номер живёт в футере и на «Контактах».
 */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logos} aria-label="ПРО-М — на главную">
          <Image
            src="/logos/logo-prom.svg"
            alt="НПП ПРО-М"
            width={150}
            height={49}
            priority
            className={styles.logoProm}
          />
          <span className={styles.divider} aria-hidden="true" />
          <Image
            src="/logos/logo-1c.svg"
            alt="Официальный партнёр 1С"
            width={72}
            height={48}
            className={styles.logo1c}
          />
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          {mainNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className={styles.navLink}
              activeClassName={styles.navLinkActive}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <RequestButton className={styles.cta} source="header" />
        </div>
      </div>
    </header>
  )
}
