import Link from 'next/link'
import styles from './CompareBlock.module.css'

export type CompareColumn = {
  title: string
  badge?: string | null
  description: string
  rows?: { label: string; value: string }[] | null
  href: string
}

type Props = {
  title: string
  lead?: string | null
  fresh: CompareColumn
  grm: CompareColumn
  /** Какая страница показывает блок. У своей колонки ссылка не рендерится */
  current: 'fresh' | 'grm'
}

/**
 * Блок «1С:Фреш или 1С:ГРМ». Один компонент на две страницы: колонки
 * приходят пропами, отличается только current. Писать зеркальную копию
 * на /grm — гарантированно получить две разошедшиеся версии одного текста.
 */
export default function CompareBlock({ title, lead, fresh, grm, current }: Props) {
  const columns: { key: 'fresh' | 'grm'; data: CompareColumn }[] = [
    { key: 'fresh', data: fresh },
    { key: 'grm', data: grm },
  ]

  return (
    <section className={styles.section} aria-labelledby="compare-heading">
      <h2 id="compare-heading" className={styles.heading}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <div className={styles.grid}>
        {columns.map(({ key, data }) => (
          <article
            key={key}
            className={styles.card}
            data-current={key === current ? '' : undefined}
          >
            <div className={styles.titleRow}>
              <h3 className={styles.name}>{data.title}</h3>
              {data.badge && <span className={styles.badge}>{data.badge}</span>}
            </div>
            <p className={styles.description}>{data.description}</p>

            <dl className={styles.rows}>
              {(data.rows ?? []).map((row, i) => (
                <div key={i} className={styles.row}>
                  <dt className={styles.label}>{row.label}</dt>
                  <dd className={styles.value}>{row.value}</dd>
                </div>
              ))}
            </dl>

            {key !== current && (
              <Link href={data.href} className={styles.link}>
                Страница {data.title}
                <span aria-hidden="true"> →</span>
              </Link>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
