'use client'

import { useEffect, useId, useRef, useState } from 'react'
import styles from './ReviewQuote.module.css'

type Props = {
  text: string
  /** Кегль и цвет цитаты: на главной и на «О компании» они разные */
  className?: string
}

/**
 * Цитата отзыва: до пяти строк, длинная — с кнопкой «Показать полностью».
 *
 * Общий для главной и «О компании»: отзывы одни и те же, и длинный должен
 * сворачиваться в обоих местах одинаково.
 *
 * Нужна ли кнопка, решает замер, а не длина текста в символах: пять строк —
 * это 200 знаков в ленте на телефоне и 650 в одной колонке на планшете.
 * ResizeObserver срабатывает и при первом наблюдении, поэтому отдельного
 * замера при монтировании нет.
 *
 * Текст целиком лежит в разметке и просто обрезается CSS — поисковик
 * читает отзыв полностью.
 *
 * Кавычки-ёлочки ставит вёрстка: в поле редактор пишет чистый текст,
 * иначе половина отзывов приедет с кавычками, половина без.
 */
export default function ReviewQuote({ text, className }: Props) {
  const clampRef = useRef<HTMLSpanElement>(null)
  const textId = useId()
  const [expanded, setExpanded] = useState(false)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const clamp = clampRef.current
    // Развёрнутый текст не мерить: он помещается всегда, и кнопка
    // «Свернуть» пропала бы сразу после нажатия
    if (!clamp || expanded) return

    const observer = new ResizeObserver(() => {
      setOverflows(clamp.scrollHeight > clamp.clientHeight + 1)
    })
    observer.observe(clamp)
    return () => observer.disconnect()
  }, [expanded])

  return (
    <>
      <blockquote className={className ? `${styles.quote} ${className}` : styles.quote}>
        {/* Две обёртки, а не одна: у -webkit-box каждый ребёнок становится
            отдельным блоком, и ёлочки из ::before / ::after встали бы на
            свои строки. Внутри .text они обычные строчные */}
        <span
          id={textId}
          ref={clampRef}
          className={styles.clamp}
          data-expanded={expanded || undefined}
        >
          <span className={styles.text}>{text}</span>
        </span>
      </blockquote>

      {overflows && (
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Свернуть' : 'Показать полностью'}
        </button>
      )}
    </>
  )
}
