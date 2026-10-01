import ReviewQuote from '@/components/ui/ReviewQuote'
import styles from './ReviewGrid.module.css'

export type Review = { id: number | string; author: string; text: string }

type Props = {
  title: string
  lead?: string | null
  reviews: Review[]
}

/**
 * «Отзывы клиентов» на «О компании» — все отзывы из коллекции, в две колонки.
 *
 * Отдельный компонент, а не CompanyBlock с главной: там три отзыва в три
 * колонки, счётчики и кнопка внутри одной секции. Здесь карточек четыре
 * в две колонки.
 *
 * В карточке только имя и текст. Аватара и должности нет: отзывы взяты
 * с Яндекс Карт, а там у автора есть только имя.
 */
export default function ReviewGrid({ title, lead, reviews }: Props) {
  if (!reviews.length) return null

  return (
    <section className={styles.section} aria-labelledby="about-reviews">
      <h2 className={styles.title} id="about-reviews">
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <ul className={styles.grid}>
        {reviews.map((review) => (
          <li className={styles.card} key={review.id}>
            <p className={styles.author}>{review.author}</p>
            <ReviewQuote text={review.text} className={styles.quote} />
          </li>
        ))}
      </ul>
    </section>
  )
}
