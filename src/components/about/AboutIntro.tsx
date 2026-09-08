import Image from 'next/image'
import styles from './AboutIntro.module.css'

export type AboutPhoto = {
  url: string
  alt: string
  width: number
  height: number
}

type Props = {
  title: string
  /**
   * Необязательная, хотя в схеме поле required. Payload помечает поле
   * обязательным только для формы в админке — у глобала, который ещё ни
   * разу не сохраняли, в базе нет строки вовсе, и findGlobal отдаёт
   * undefined. Страница из-за пустого контента падать не должна.
   */
  body?: string | null
  photo?: AboutPhoto | null
}

/**
 * Первый экран «О компании»: H1 через всю ширину, текст слева, фото справа.
 *
 * Абзацы приходят одной строкой из textarea и режутся по переводу строки —
 * тот же приём, что в ProductIntro. Пустые строки отбрасываются: редактор
 * почти всегда оставляет двойной перенос между абзацами.
 *
 * Фото необязательное. Пока его нет, на месте стоит серая плашка той же
 * высоты: без неё правая колонка схлопывается и текст растягивается на всю
 * ширину, а при появлении фотографии вёрстка прыгает обратно.
 */
export default function AboutIntro({ title, body, photo }: Props) {
  const paragraphs = (body ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{title}</h1>

      <div className={styles.grid}>
        <div className={styles.text}>
          {paragraphs.map((paragraph) => (
            <p className={styles.paragraph} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        {photo ? (
          <Image
            className={styles.photo}
            src={photo.url}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
          />
        ) : (
          /* aria-hidden: заглушка ничего не сообщает, и объявлять её
             скринридеру нечем — это пустое место, а не изображение */
          <div className={styles.placeholder} aria-hidden="true" />
        )}
      </div>
    </section>
  )
}
