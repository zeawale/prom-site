'use client'

import { useId, useState } from 'react'
import Link from 'next/link'
import { RequestButton } from '@/components/layout/RequestButton'
import styles from './StateCards.module.css'

export type StateSolution = {
  eyebrow: string
  title: string
  text: string
  href: string
}

export type StateItem = {
  title: string
  description: string
  criteria: string[]
  solutions: StateSolution[]
}

type Props = {
  title: string
  lead?: string | null
  openLabel: string
  closeLabel: string
  criteriaTitle: string
  solutionLabel: string
  items: StateItem[]
  footerText: string
  footerButton: string
  phone: string
  phoneRaw: string
}

/**
 * «Где вы сейчас» — четыре состояния, подробности раскрываются под сеткой.
 *
 * Открыто может быть только одно: это диагностика, посетитель выбирает
 * свою ситуацию, а не сравнивает четыре сразу.
 *
 * Раньше раскрытая карточка растягивалась на обе колонки прямо в сетке —
 * от этого сетка перестраивалась, соседи прыгали, а рядом с первой
 * карточкой оставалась дыра. Теперь сетка 2×2 стоит на месте всегда, а
 * содержимое выезжает отдельной панелью под ней: ничего выше панели не
 * сдвигается, и прокрутку не срывает.
 *
 * Кликается карточка целиком, поэтому она и есть <button>, а «Это про
 * меня» внутри — обычный span. Вложить кнопку в кнопку нельзя: разметка
 * невалидна, а с клавиатуры получаются две остановки табом на одном
 * элементе.
 *
 * shown держит последний выбранный индекс отдельно от active. Без него
 * при сворачивании содержимое панели пропадало бы в тот же кадр, и
 * анимация схлопывания шла бы по пустому блоку.
 */
export default function StateCards({
  title,
  lead,
  openLabel,
  closeLabel,
  criteriaTitle,
  solutionLabel,
  items,
  footerText,
  footerButton,
  phone,
  phoneRaw,
}: Props) {
  const [active, setActive] = useState<number | null>(null)
  const [shown, setShown] = useState(0)
  const baseId = useId()

  if (!items.length) return null

  const panelId = `${baseId}-panel`
  const current = items[active ?? shown] ?? items[0]
  const currentNumber = String((active ?? shown) + 1).padStart(2, '0')

  const toggle = (i: number) => {
    setActive((cur) => (cur === i ? null : i))
    setShown(i)
  }

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <h2 className={styles.title} id={`${baseId}-title`}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <ul className={styles.grid}>
        {items.map((item, i) => {
          const open = active === i

          return (
            <li key={item.title} className={styles.cell}>
              <button
                type="button"
                className={styles.card}
                data-open={open || undefined}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className={styles.head}>
                  <span className={styles.number} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={styles.cardTitle}>{item.title}</span>
                </span>

                <span className={styles.description}>{item.description}</span>

                <span className={styles.toggle}>{open ? closeLabel : openLabel}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {/* Обёртка живёт в разметке всегда — иначе высоту нечем анимировать.
          Пока она свёрнута, внутренности переходят в visibility: hidden с
          задержкой на длину анимации: содержимое видно до конца схлопывания,
          но ссылки внутри выпадают из обхода табом и из скринридера */}
      <div className={styles.panelWrap} data-open={active !== null || undefined}>
        <div className={styles.panelInner}>
          <div className={styles.panel} id={panelId} role="region" aria-label={current.title}>
            <div className={styles.panelHead}>
              <span className={styles.number} aria-hidden="true">
                {currentNumber}
              </span>
              <h3 className={styles.panelTitle}>{current.title}</h3>
              <button type="button" className={styles.close} onClick={() => setActive(null)}>
                {closeLabel}
              </button>
            </div>

            <div className={styles.panelBody}>
              <div className={styles.criteria}>
                <p className={styles.criteriaTitle}>{criteriaTitle}</p>
                <ul className={styles.criteriaList}>
                  {current.criteria.map((text) => (
                    <li key={text} className={styles.criteriaItem}>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.solutions}>
                {current.solutions.map((solution) => (
                  <div key={solution.href + solution.title} className={styles.solution}>
                    <div className={styles.solutionHead}>
                      <p className={styles.eyebrow}>{solution.eyebrow}</p>
                      <Link href={solution.href} className={styles.solutionLink}>
                        {solutionLabel}
                        {/* Название продукта повторяется для скринридера:
                            несколько кнопок «Перейти» подряд вне контекста
                            карточки неразличимы */}
                        <span className={styles.srOnly}> — {solution.title}</span>
                      </Link>
                    </div>
                    <p className={styles.solutionTitle}>{solution.title}</p>
                    <p className={styles.solutionText}>{solution.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <p className={styles.footerText}>{footerText}</p>
        <div className={styles.footerActions}>
          <a className={styles.phone} href={`tel:${phoneRaw}`}>
            {phone}
          </a>
          <RequestButton className={styles.footerButton} source="home-states">
            {footerButton}
          </RequestButton>
        </div>
      </div>
    </section>
  )
}
