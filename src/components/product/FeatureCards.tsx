import { Icon } from '@/components/ui/Icon'
import type { IconName } from '@/lib/icons'
import styles from './FeatureCards.module.css'

export type FeatureCard = {
  icon?: IconName | null
  title?: string | null
  text: string
  list?: string[]
}

export type FeatureCardsProps = {
  id: string
  title?: string | null
  layout: 'icon' | 'title' | 'icon-title'
  columns?: 2 | 4
  cards: FeatureCard[]
  headingLevel?: 2 | 3
}

export default function FeatureCards({ id, title, layout, columns = 2, headingLevel = 2, cards }: FeatureCardsProps) {
  if (!cards.length) return null
  const Heading = `h${headingLevel}` as const
  const headingId = `features-${id}`
  const showIcon = layout === 'icon' || layout === 'icon-title'
  const showTitle = layout === 'title' || layout === 'icon-title'

  return (
    <section className={styles.section} aria-labelledby={title ? headingId : undefined}>
      {title && (
        <Heading id={headingId} className={headingLevel === 3 ? styles.subheading : styles.heading}>
          {title}
        </Heading>
      )}

      <ul className={styles.grid} data-columns={columns}>
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
