import styles from './ContactCards.module.css'

export type ContactCard = {
  label: string
  value: string
  caption?: string | null
  /** Телефон и почта кликаются, остальные четыре — просто текст */
  href?: string | null
}

type Props = {
  items: ContactCard[]
}

/**
 * Шесть карточек-реквизитов.
 *
 * Значения приходят из глобала Settings — того же, что кормит шапку и
 * футер. В глобале Contacts лежат только заголовок карточки и подпись
 * под значением: продублировать телефон в двух местах значит однажды
 * получить два разных телефона на одном сайте.
 *
 * Разметка — dl: каждая карточка это пара «что» и «чему равно». Подпись
 * идёт вторым dd в той же паре, а не отдельным элементом.
 */
export default function ContactCards({ items }: Props) {
  if (!items.length) return null

  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li className={styles.card} key={item.label}>
          <dl className={styles.pair}>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>
              {item.href ? (
                <a className={styles.link} href={item.href}>
                  {item.value}
                </a>
              ) : (
                item.value
              )}
            </dd>
            {item.caption && <dd className={styles.caption}>{item.caption}</dd>}
          </dl>
        </li>
      ))}
    </ul>
  )
}
