import type { ReactNode } from 'react'
import styles from './TariffCards.module.css'

export type TariffItem = {
  kind?: 'check' | 'note' | null
  text: string
  list?: { text: string }[] | null
}

export type TariffCard = {
  name: string
  badge?: string | null
  whoFits: string
  seats: string
  seatsLabel: string
  bases: string
  basesLabel: string
  items?: TariffItem[] | null
}

type Props = {
  title: string
  lead?: string | null
  cards: TariffCard[]
  disclaimer?: string | null
  children?: ReactNode
}


export default function TariffCards({ title, lead, cards, disclaimer, children }: Props) {
  if (!cards.length) return null

  return (
    <section className={styles.section} aria-labelledby="tariffs-heading">
      <h2 id="tariffs-heading" className={styles.heading}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <div className={styles.grid}>
        {cards.map((card, i) => (
          <article key={i} className={styles.card} data-featured={card.badge ? '' : undefined}>
            <div className={styles.titleRow}>
              <h3 className={styles.name}>{card.name}</h3>
              {card.badge && <span className={styles.badge}>{card.badge}</span>}
            </div>
            <p className={styles.whoFits}>{card.whoFits}</p>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{card.seats}</span>
                <span className={styles.metricLabel}>{card.seatsLabel}</span>
              </div>
              <div className={styles.metric}>
                <span className={styles.metricValue}>{card.bases}</span>
                <span className={styles.metricLabel}>{card.basesLabel}</span>
              </div>
            </div>

            <ul className={styles.features}>
              {(card.items ?? []).map((item, j) => (
                <li key={j} className={styles.feature} data-kind={item.kind ?? 'check'}>
                  {item.kind !== 'note' && (
                    // Галочка декоративная: она означает «включено», а это уже
                    // сказано тем, что пункт вообще перечислен в тарифе
                    <svg
                      className={styles.check}
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path
                        d="M7.5 12.5l3 3 6-6.5"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}

                  <div className={styles.featureBody}>
                    <span>{item.text}</span>
                    {item.list && item.list.length > 0 && (
                      <ul className={styles.subList}>
                        {item.list.map((sub, k) => (
                          <li key={k}>{sub.text}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {children}
    {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
    </section>
  )
}