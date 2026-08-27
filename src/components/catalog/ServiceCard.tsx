'use client'

import type { Service } from '@/payload-types'
import { visibleRelated } from '@/lib/services'
import { Icon } from '@/components/ui/Icon'
import { useServiceModal } from './ServiceModalProvider'
import styles from './ServiceCard.module.css'

export function ServiceCard({ service }: { service: Service }) {
  const { open } = useServiceModal()

  const related = visibleRelated(service.related)

  const categorySlug =
    typeof service.category === 'object' && service.category !== null
      ? service.category.slug
      : null

  if (!categorySlug) return null

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => open(categorySlug, service.slug)}
    >
      <div className={styles.head}>
        <span className={styles.iconBox}>
          <Icon slug={service.icon} size={20} />
        </span>
        <h2 className={styles.title}>{service.title}</h2>

        {(service.isPopular || service.isNew) && (
          <div className={styles.badges}>
            {service.isPopular && (
              <span className={`${styles.badge} ${styles.badgePopular}`}>
                Популярное
              </span>
            )}
            {service.isNew && (
              <span className={`${styles.badge} ${styles.badgeNew}`}>Новинка</span>
            )}
          </div>
        )}
      </div>

      <p className={styles.headline}>{service.headline}</p>
      <p className={styles.description}>{service.description}</p>

      {related.length > 0 && (
        <p className={styles.related}>
          <span className={styles.relatedLabel}>Часто берут вместе с:</span>
          {related.map((r, i) => (
            <span key={r.id}>
              {i > 0 && ', '}
              <span className={styles.relatedItem}>{r.title}</span>
            </span>
          ))}
        </p>
      )}
    </button>
  )
}