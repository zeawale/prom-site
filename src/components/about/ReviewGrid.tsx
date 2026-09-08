import styles from './ReviewGrid.module.css'

export type Review = { id: number | string; author: string; role: string; text: string }

type Props = {
  title: string
  lead?: string | null
  reviews: Review[]
}

/**
 * «Отзывы клиентов» на «О компании» — все отзывы из коллекции, в две колонки.
 *
 * Отдельный компонент, а не CompanyBlock с главной: там три отзыва в три
 * колонки, счётчики и кнопка внутри одной секции, а карточка без аватара.
 * Здесь карточек четыре в две колонки, у каждой кружок слева от имени.
 *
 * Кружок пока пустой: в коллекции Reviews поля с фотографией нет — так
 * решено при её проектировании, потому что реальных фотографий не было.
 * Появятся — сюда добавится upload-поле и картинка в этот же кружок,
 * вёрстка не меняется. До тех пор он aria-hidden: пустому месту нечего
 * сообщать скринридеру.
 *
 * Кавычки-ёлочки ставит вёрстка (::before / ::after), как и на главной:
 * в поле редактор пишет чистый текст.
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
            <div className={styles.head}>
              <div className={styles.avatar} aria-hidden="true" />
              <div className={styles.person}>
                <p className={styles.author}>{review.author}</p>
                <p className={styles.role}>{review.role}</p>
              </div>
            </div>

            <blockquote className={styles.quote}>{review.text}</blockquote>
          </li>
        ))}
      </ul>
    </section>
  )
}
