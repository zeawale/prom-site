import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/lib/icons'
import styles from './FeatureCards.module.css'

export type FeatureCard = {
  icon?: IconName | null
  title?: string | null
  text: string
  /** Маркированный список внутри карточки. Есть только у двух карточек КА */
  list?: string[]
}

export type FeatureCardsProps = {
  id: string
  title?: string | null
  /** icon — иконка + текст, title — заголовок + текст, icon-title — всё сразу */
  layout: 'icon' | 'title' | 'icon-title'
  cards: FeatureCard[]
}

export default function FeatureCards({ id, title, layout, cards }: FeatureCardsProps) {
  if (!cards.length) return null

  const headingId = `features-${id}`
  const showIcon = layout === 'icon' || layout === 'icon-title'
  const showTitle = layout === 'title' || layout === 'icon-title'

  return (
    <section className={styles.section} aria-labelledby={title ? headingId : undefined}>
      {title && (
        <h2 id={headingId} className={styles.heading}>
          {title}
        </h2>
      )}

      <ul className={styles.grid}>
        {cards.map((card, i) => (
          <li key={i} className={styles.card}>
            {showIcon && card.icon && (
              <span className={styles.iconBox}>
                {/* Если сигнатура Icon другая — правится только эта строка */}
                <Icon slug={card.icon} />
              </span>
            )}

            {showTitle && card.title && <h3 className={styles.cardTitle}>{card.title}</h3>}

            <p className={styles.text}>{card.text}</p>

            {card.list && card.list.length > 0 && (
              <ul className={styles.list}>
                {card.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
