'use client'

import { useId, useState } from 'react'
import styles from './Faq.module.css'

export type FaqItem = { question: string; answer: string }

type Props = {
  id?: string
  title: string
  items: FaqItem[]
}

/**
 * Аккордеон вопросов и ответов.
 *
 * Открытых может быть сколько угодно: человек сравнивает ответы, и
 * закрывать предыдущий при открытии следующего здесь вредно — в отличие
 * от «Где вы сейчас», где выбор состояния один.
 *
 * Первый вопрос раскрыт изначально, как в макете: пустой список из
 * пяти строк выглядит как нерабочий блок.
 *
 * <details> не подошёл: значок плюс/минус в макете — часть кнопки
 * справа, а нативный маркер summary в Safari до сих пор не убирается
 * без ::-webkit-details-marker, и разъезжается вся строка.
 */
export default function Faq({ id, title, items }: Props) {
  const [open, setOpen] = useState<number[]>([0])
  const baseId = useId()

  if (!items.length) return null

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((n) => n !== i) : [...cur, i]))

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <h2 className={styles.title} id={id ? `${id}-faq` : `${baseId}-title`}>
        {title}
      </h2>

      <ul className={styles.list}>
        {items.map((item, i) => {
          const expanded = open.includes(i)
          const panelId = `${baseId}-answer-${i}`

          return (
            <li className={styles.item} key={item.question}>
              <h3 className={styles.questionRow}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                >
                  <span>{item.question}</span>
                  <span className={styles.sign} aria-hidden="true">
                    {expanded ? '−' : '+'}
                  </span>
                </button>
              </h3>

              {expanded && (
                <div className={styles.answer} id={panelId}>
                  {item.answer.split('\n').map((paragraph) => (
                    <p className={styles.paragraph} key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
