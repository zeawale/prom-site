import PageHero from '@/components/product/PageHero'
import styles from './LegalDocument.module.css'

export type LegalSection = {
  heading?: string | null
  paragraphs?: { text: string }[] | null
  listType?: ('ordered' | 'unordered') | null
  list?: { text: string }[] | null
}

type Props = {
  title: string
  lead?: string | null
  effectiveDate: string
  sections: LegalSection[]
}

/**
 * Общее тело всех трёх юридических страниц. Данные приходят пропом,
 * страница только достаёт свой документ по слагу.
 *
 * Дата редакции выводится <time> с машинным datetime: это реквизит
 * документа, а не украшение, и он должен читаться не только глазами.
 */
export default function LegalDocument({ title, lead, effectiveDate, sections }: Props) {
  // toLocaleDateString с явной локалью, а не по умолчанию: сервер и браузер
  // могут стоять в разных локалях, и дата разъехалась бы при гидратации
  const readable = new Date(effectiveDate).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const machine = new Date(effectiveDate).toISOString().slice(0, 10)

  return (
    <main className="container">
      <PageHero title={title} lead={lead} level={1} />

      <p className={styles.date}>
        Редакция от <time dateTime={machine}>{readable}</time>
      </p>

      <article className={styles.document}>
        {sections.map((section, i) => (
          <section key={i} className={styles.section}>
            {section.heading && <h2 className={styles.heading}>{section.heading}</h2>}

            {(section.paragraphs ?? []).map((p, j) => (
              <p key={j} className={styles.paragraph}>
                {p.text}
              </p>
            ))}

            {section.list && section.list.length > 0 && (
              <ListTag type={section.listType}>
                {section.list.map((item, j) => (
                  <li key={j} className={styles.item}>
                    {item.text}
                  </li>
                ))}
              </ListTag>
            )}
          </section>
        ))}
      </article>
    </main>
  )
}

function ListTag({
  type,
  children,
}: {
  type?: ('ordered' | 'unordered') | null
  children: React.ReactNode
}) {
  const className = type === 'ordered' ? styles.ordered : styles.unordered
  return type === 'ordered' ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  )
}
