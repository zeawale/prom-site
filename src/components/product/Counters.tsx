import styles from './Counters.module.css'

export type Counter = { value: string; caption: string }

type Props = {
  items: Counter[]
  /** Три на главной, четыре на «О компании» */
  columns?: 3 | 4
  className?: string
}

/**
 * Белая полоса со счётчиками компании.
 *
 * Вынесен из CompanyBlock, когда те же счётчики понадобились на
 * «О компании» — только там их четыре, а не три. Второй экземпляр
 * означал бы две вёрстки одного блока, которые разойдутся при первой
 * же правке отступов.
 *
 * Числа — обычный текст, а не анимированный отсчёт: «20+» должно
 * читаться сразу, в том числе скринридером и поисковым роботом.
 *
 * dl/dt/dd, а не div: число и подпись — это пара «значение и что оно
 * значит», ровно то, для чего список определений и существует.
 */
export default function Counters({ items, columns = 3, className }: Props) {
  if (!items.length) return null

  return (
    <dl className={[styles.counters, className].filter(Boolean).join(' ')} data-columns={columns}>
      {items.map((counter) => (
        <div className={styles.counter} key={counter.value + counter.caption}>
          <dt className={styles.value}>{counter.value}</dt>
          <dd className={styles.caption}>{counter.caption}</dd>
        </div>
      ))}
    </dl>
  )
}
