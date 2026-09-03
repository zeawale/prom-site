import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/queries'
import { legalNav } from '@/lib/navigation'
import { Icon } from '@/components/ui/Icon'
import styles from './Footer.module.css'

export async function Footer() {
  const settings = await getSettings()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Image
          src="/logos/logo-prom.svg"
          alt="НПП ПРО-М"
          width={360}
          height={118}
          className={styles.logo}
        />

        <div className={styles.columns}>
          <section className={styles.column}>
            <h2 className={styles.columnTitle}>Информация</h2>
            <div className={styles.columnBody}>
              <p className={styles.line}>{settings.address}</p>
              <p className={styles.line}>{settings.legalName}</p>
              <p className={styles.line}>ИНН {settings.inn}</p>
            </div>
          </section>

          <section className={styles.column}>
            <h2 className={styles.columnTitle}>Контакты</h2>
            <div className={styles.columnBody}>
              <p className={styles.lineWithIcon}>
                <Icon slug="phone" size={16} className={styles.icon} />
                <a href={`tel:${settings.phoneRaw}`} className={styles.link}>
                  {settings.phone}
                </a>
              </p>
              <p className={styles.lineWithIcon}>
                <Icon slug="email" size={16} className={styles.icon} />
                <a href={`mailto:${settings.email}`} className={styles.link}>
                  {settings.email}
                </a>
              </p>
              <p className={styles.lineWithIcon}>
                <Icon slug="clock" size={16} className={styles.icon} />
                <span>{settings.workHours}</span>
              </p>
            </div>
          </section>

          <section className={styles.column}>
            <h2 className={styles.columnTitle}>Документы</h2>
            <div className={styles.columnBody}>
              {legalNav.map((item) => (
                <Link key={item.href} href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </footer>
  )
}
