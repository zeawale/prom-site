import Link from 'next/link'
import styles from './CompanyBlock.module.css'

export type Counter = { value: string; caption: string }
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
 * Счётчики — обычный текст, а не анимированный отсчёт: цифра «20+»
 * должна читаться сразу, в том числе скринридером и в поиске.
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

      {counters.length > 0 && (
        <dl className={styles.counters}>
          {counters.map((counter) => (
            <div className={styles.counter} key={counter.value + counter.caption}>
              <dt className={styles.value}>{counter.value}</dt>
              <dd className={styles.caption}>{counter.caption}</dd>
            </div>
          ))}
        </dl>
      )}

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
