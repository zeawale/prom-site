import Link from 'next/link'
import Counters, { type Counter } from '@/components/product/Counters'
import ReviewQuote from '@/components/ui/ReviewQuote'
import styles from './CompanyBlock.module.css'

export type { Counter }
export type Review = { id: number | string; author: string; text: string }

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
 * Цитату рисует ReviewQuote — общий с «О компании»: ёлочки и обрезка
 * длинного отзыва там.
 *
 * Ссылка «Подробнее о компании» стоит в разметке дважды: в шапке блока
 * для десктопа и под отзывами для планшета и телефона, лишняя спрятана
 * через display: none. Раньше она была одна и уезжала вниз через order —
 * на экране последней, а в обходе табом первой, раньше кнопок в отзывах.
 * Спрятанная через display: none ссылка не попадает ни в обход табом, ни
 * в дерево доступности, так что дубля для скринридера нет.
 */
export default function CompanyBlock({
  title,
  lead,
  buttonLabel,
  buttonHref,
  counters,
  reviews,
}: Props) {
  const label = buttonLabel ?? 'Подробнее о компании'

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
          <Link href={buttonHref} className={`${styles.button} ${styles.buttonTop}`}>
            {label}
          </Link>
        )}
      </div>

      {/* Та же полоса счётчиков, что на «О компании»: общий компонент и
          общие цифры из Settings */}
      <Counters items={counters} columns={3} className={styles.counters} />

      {reviews.length > 0 && (
        <ul className={styles.reviews}>
          {reviews.map((review) => (
            <li className={styles.review} key={review.id}>
              <p className={styles.author}>{review.author}</p>
              <ReviewQuote text={review.text} className={styles.quote} />
            </li>
          ))}
        </ul>
      )}

      {buttonHref && (
        <Link href={buttonHref} className={`${styles.button} ${styles.buttonBottom}`}>
          {label}
        </Link>
      )}
    </section>
  )
}
