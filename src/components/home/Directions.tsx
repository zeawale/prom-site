import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'
import styles from './Directions.module.css'

export type Direction = {
  icon?: string | null
  title: string
  lead: string
  list: string[]
  href: string
  buttonLabel?: string | null
}

/**
 * «Направления работы» — три продукта на синем фоне.
 *
 * Не FeatureCards: у тех карточка это иконка с текстом, а здесь у каждой
 * свой заголовок, оранжевая строка «кому подходит», список с маркерами
 * и кнопка. Натягивать это на общий компонент значило бы добавить ему
 * четыре опциональных поля ради одного места на сайте.
 */
export default function Directions({ title, items }: { title: string; items: Direction[] }) {
  if (!items.length) return null

  return (
    <section aria-labelledby="home-directions">
      <h2 className={styles.title} id="home-directions">
        {title}
      </h2>

      <ul className={styles.grid}>
        {items.map((item) => (
          <li className={styles.card} key={item.href}>
            {item.icon && (
              <span className={styles.iconBox}>
                <Icon slug={item.icon} size={20} />
              </span>
            )}

            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.lead}>{item.lead}</p>

            <ul className={styles.list}>
              {item.list.map((text) => (
                <li className={styles.item} key={text}>
                  {text}
                </li>
              ))}
            </ul>

            {/* margin-block-start: auto прижимает кнопку к низу карточки —
                иначе три карточки с разным числом пунктов встают вразнобой */}
            <Link href={item.href} className={styles.button}>
              {item.buttonLabel ?? 'Подробнее'}
              <span className={styles.srOnly}> — {item.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
