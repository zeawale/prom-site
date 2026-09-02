import type { ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'
import ShortFacts, { type ShortFact } from './ShortFacts'
import styles from './ProductIntro.module.css'

export type ProductIntroProps = {
  id: string
  /** Название программы. Выводится полужирным в начале первого абзаца */
  bodyStrong: string
  /** Продолжение того же предложения, обычным начертанием */
  bodyIntro: string
  /** Остальной текст, абзацы разделены переводом строки */
  body: string
  facts: ShortFact[]
  suits?: string | null
  /**
   * Кнопка приходит готовым узлом, а не текстом.
   * Так компонент не тянет RequestButton (он клиентский) и не знает про
   * источник заявки — страница сама решает, что подставить.
   */
  cta?: ReactElement<{ className?: string }>
}

export default function ProductIntro({
  id,
  bodyStrong,
  bodyIntro,
  body,
  facts,
  suits,
  cta,
}: ProductIntroProps) {
  // Абзацы приходят строкой с \n — textarea в CMS хранит именно так.
  // filter отсекает пустые строки от двойных переводов.
  const paragraphs = body.split('\n').filter((p) => p.trim())

  const button = isValidElement(cta)
    ? cloneElement(cta, { className: styles.button })
    : cta

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <div className={styles.text}>
          {/* Выделено только название, остальное обычным начертанием.
              Два поля вместо разметки внутри строки: парсить **звёздочки**
              значило бы вернуть сложность, ради ухода от которой
              отказались от richText. */}
          <p className={styles.paragraph}>
            <strong className={styles.strong}>{bodyStrong}</strong> {bodyIntro}
          </p>

          {paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p}
            </p>
          ))}
        </div>

        {cta && <div className={styles.cta}>{button}</div>}
      </div>

      <ShortFacts id={id} items={facts} suits={suits} />
    </div>
  )
}