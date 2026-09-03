'use client'

import type { Service } from '@/payload-types'
import { Icon } from '@/components/ui/Icon'
import { useServiceModal } from './ServiceModalProvider'
import { ServiceBody } from './ServiceBody'
import styles from './ServiceDetail.module.css'

export function ServiceDetailClient({ service }: { service: Service }) {
  const { open } = useServiceModal()

  return (
    <ServiceBody
      service={service}
      source="service"
      renderRelated={(related) =>
        related.map((r) => {
          const cat = typeof r.category === 'object' && r.category !== null ? r.category.slug : null
          if (!cat) return null

          return (
            <button
              key={r.id}
              type="button"
              className={styles.relatedCard}
              onClick={() => open(cat, r.slug)}
            >
              <Icon slug={r.icon} size={20} className={styles.relatedIcon} />
              <span className={styles.relatedTitle}>{r.title}</span>
            </button>
          )
        })
      }
    />
  )
}
