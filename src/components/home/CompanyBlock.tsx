import Link from 'next/link'
import Counters, { type Counter } from '@/components/product/Counters'
import styles from './CompanyBlock.module.css'

export type { Counter }
export type Review = { id: number | string; author: string; role: string; text: string }

type Props = {
  title: string
  lead?: string | null
  buttonLabel?: string | null
  buttonHref?: string | null
  counters: Counter[]
  reviews: Review[]
}

/**
 * «С кем вы будете работать»: счётчики компании и отзывы клиентов.
 *
 * Кавычки-ёлочки ставит вёрстка (::before / ::after), а не редактор:
 * иначе в базе половина отзывов окажется с кавычками, половина без.
 */
export default function CompanyBlock({
  title,
  lead,
  buttonLabel,
  buttonHref,
  counters,
  reviews,
}: Props) {
  return (
    <section className={styles.section} aria-labelledby="home-company">
      <div className={styles.head}>
        <div>
          <h2 className={styles.title} id="home-company">
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </div>

        {buttonHref && (
          <Link href={buttonHref} className={styles.button}>
            {buttonLabel ?? 'Подробнее о компании'}
          </Link>
        )}
      </div>

      {/* Та же полоса счётчиков, что на «О компании», — общий компонент.
          Здесь их три, там четыре; отличается только число колонок */}
      <Counters items={counters} columns={3} className={styles.counters} />

      {reviews.length > 0 && (
        <ul className={styles.reviews}>
          {reviews.map((review) => (
            <li className={styles.review} key={review.id}>
              <p className={styles.author}>{review.author}</p>
              <p className={styles.role}>{review.role}</p>
              <blockquote className={styles.quote}>{review.text}</blockquote>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
