import styles from './ShortFacts.module.css'

export type ShortFact = {
  fact: string
  caption: string
}

export type ShortFactsProps = {
  /** Для связи заголовка карточки с секцией. Обычно слаг программы */
  id: string
  items: ShortFact[]
  suits?: string | null
  /** «Коротко о сервисе» по умолчанию */
  label?: string
}

export default function ShortFacts({
  id,
  items,
  suits,
  label = 'Коротко о сервисе',
}: ShortFactsProps) {
  const headingId = `short-facts-${id}`

  return (
    <section className={styles.card} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.label}>
        {label}
      </h2>

      {/* dl, а не набор div: «3 версии» — термин, «Базовая, ПРОФ, КОРП» — его
          расшифровка. Скринридер объявит их связанными, а не двумя абзацами */}
      <dl className={styles.list}>
        {items.map(({ fact, caption }, i) => (
          <div key={i} className={styles.item}>
            <dt className={styles.fact}>{fact}</dt>
            <dd className={styles.caption}>{caption}</dd>
          </div>
        ))}
      </dl>

      {suits && (
        <p className={styles.suits}>
          <span className={styles.suitsLabel}>Подходит:</span> {suits}
        </p>
      )}
    </section>
  )
}