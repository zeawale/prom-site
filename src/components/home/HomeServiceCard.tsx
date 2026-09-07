'use client'

import type { Service } from '@/payload-types'
import { useServiceModal } from '@/components/catalog/ServiceModalProvider'
import styles from './ServicesPreview.module.css'

/**
 * Карточка сервиса на главной. Открывает тот же попап, что и каталог —
 * поэтому компонент клиентский и зовёт useServiceModal.
 *
 * Кнопка, а не ссылка: переход на страницу сервиса тут не нужен,
 * посетитель остался бы без главной. Прямые адреса сервисов никуда
 * не делись, они работают из каталога и из поиска.
 */
export default function HomeServiceCard({
  service,
  buttonLabel,
}: {
  service: Service
  buttonLabel: string
}) {
  const { open } = useServiceModal()

  const categorySlug =
    typeof service.category === 'object' && service.category !== null ? service.category.slug : null

  if (!categorySlug) return null

  return (
    <li className={styles.card}>
      <h3 className={styles.cardTitle}>{service.title}</h3>
      <p className={styles.headline}>{service.headline}</p>

      <button
        type="button"
        className={styles.button}
        onClick={() => open(categorySlug, service.slug)}
      >
        {buttonLabel}
        <span className={styles.srOnly}> — {service.title}</span>
      </button>
    </li>
  )
}
