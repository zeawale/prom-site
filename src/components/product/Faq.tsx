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
 * Аккордеон вопросов и ответов: один общий скруглённый блок, вопросы
 * внутри разделены линиями.
 *
 * Открыт всегда ровно один вопрос — так в макете. Клик по открытому
 * закрывает его, и тогда открытых нет вовсе.
 *
 * Первый вопрос раскрыт изначально: пустой список из пяти строк выглядит
 * как нерабочий блок.
 *
 * <details> не подошёл: значок плюс/минус в макете — часть кнопки
 * справа, а нативный маркер summary в Safari до сих пор не убирается
 * без ::-webkit-details-marker, и разъезжается вся строка.
 */
export default function Faq({ id, title, items }: Props) {
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  if (!items.length) return null

  const toggle = (i: number) => setOpen((cur) => (cur === i ? null : i))

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <h2 className={styles.title} id={id ? `${id}-faq` : `${baseId}-title`}>
        {title}
      </h2>

      <ul className={styles.list}>
        {items.map((item, i) => {
          const expanded = open === i
          const panelId = `${baseId}-answer-${i}`

          return (
            <li className={styles.item} key={item.question} data-open={expanded || undefined}>
              {/* Заголовок нужен для оглавления страницы у скринридера,
                  кнопка — для управления. Поэтому кнопка внутри h3 */}
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

              {/* Ответ остаётся в разметке всегда: высоту схлопнутого блока
                  анимировать нечем, если его нет. Пока он свёрнут, содержимое
                  уходит в visibility: hidden с задержкой на длину анимации —
                  видно до конца схлопывания, но из обхода табом и из
                  скринридера уже выпало */}
              <div className={styles.answerWrap} data-open={expanded || undefined}>
                <div className={styles.answerInner}>
                  <div className={styles.answer} id={panelId}>
                    {item.answer.split('\n').map((paragraph, n) => (
                      // Ключ по индексу намеренно: в ответе встречаются
                      // повторы и пустые строки, текст уникальным ключом
                      // быть не может
                      <p className={styles.paragraph} key={n}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
