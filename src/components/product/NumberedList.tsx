import type { CSSProperties } from 'react'
import styles from './NumberedList.module.css'

type Item = {
  title: string
  text: string
}

type Props = {
  id?: string
  title: string
  /** Абзац под заголовком. Есть у главной, нет у /its — как lead у FeatureCards */
  lead?: string | null
  items: Item[]
}

const COLUMNS = 2

/**
 * «Что входит в сопровождение» — синяя секция с пунктами 01–06.
 *
 * Разметка — <ol>: это нумерованный перечень, а не набор карточек.
 * Сами цифры рисуются индексом и помечены aria-hidden — порядок уже
 * передан списком, скринридер не должен читать «ноль один» дважды.
 */
export default function NumberedList({ id, title, lead, items }: Props) {
  if (!items.length) return null

  // Число строк считаем здесь, а не хардкодим в CSS: grid-auto-flow: column
  // требует явных строк, иначе поток снова поедет по горизонтали.
  // Пунктов в CMS может быть и 4, и 8 — раскладка не должна от этого зависеть
  const rows = Math.ceil(items.length / COLUMNS)

  return (
    <section className={styles.section} aria-labelledby={id ? `${id}-included` : undefined}>
      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.title} id={id ? `${id}-included` : undefined}>
            {title}
          </h2>
          {lead && <p className={styles.lead}>{lead}</p>}
        </header>

        <ol className={styles.list} style={{ '--rows': rows } as CSSProperties}>
          {items.map((item, i) => (
            <li className={styles.item} key={item.title}>
              <span className={styles.number} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className={styles.body}>
                <h3 className={styles.itemTitle}>{item.title}</h3>
                <p className={styles.itemText}>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
