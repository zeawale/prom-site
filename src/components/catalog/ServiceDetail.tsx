import Link from 'next/link'
import type { Service } from '@/payload-types'
import { Icon } from '@/components/ui/Icon'
import { ServiceBody } from './ServiceBody'
import styles from './ServiceDetail.module.css'

/** Ссылка на сервис: /services/[категория]/[слаг] */
function serviceHref(s: Service): string | null {
  const cat = typeof s.category === 'object' && s.category !== null ? s.category.slug : null
  return cat ? `/services/${cat}/${s.slug}` : null
}

export function ServiceDetail({ service }: { service: Service }) {
  return (
    <ServiceBody
      service={service}
      source="service-page"
      renderRelated={(related) =>
        related.map((r) => {
          const href = serviceHref(r)
          if (!href) return null

          return (
            <Link key={r.id} href={href} className={styles.relatedCard}>
              <Icon slug={r.icon} size={20} className={styles.relatedIcon} />
              <span className={styles.relatedTitle}>{r.title}</span>
            </Link>
          )
        })
      }
    />
  )
}
