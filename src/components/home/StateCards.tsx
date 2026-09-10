'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
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
  criteriaTitle: string
  solutionLabel: string
  items: StateItem[]
  footerText: string
  footerButton: string
  phone: string
  phoneRaw: string
}

/**
 * «Где вы сейчас» — четыре состояния слева, подробности справа.
 *
 * Раскладка: столбец карточек в левой колонке, панель с подробностями в
 * правой. Одно состояние выбрано всегда, свернуть всё нельзя. Прежние
 * версии — сначала карточка, растягивавшаяся на обе колонки сетки 2×2,
 * потом панель, выезжавшая под сеткой, — обе решали одну проблему: куда
 * девать раскрытое содержимое, чтобы не двигать соседей. Две колонки
 * снимают вопрос совсем: подробности стоят на своём месте с самого
 * начала, ничто никуда не выезжает, и первое состояние видно сразу, без
 * клика.
 *
 * Это ровно паттерн вкладок, поэтому и разметка вкладочная: role="tablist"
 * на списке, role="tab" на карточках, role="tabpanel" на панели. Отсюда же
 * управление с клавиатуры — по списку вкладок ходят стрелками, а не табом:
 * в обходе табом весь список занимает одну остановку, дальше фокус уходит
 * в панель. Home и End прыгают на первую и последнюю.
 *
 * Карточка целиком — <button>: кликается вся, а не подпись внутри.
 * Вложить кнопку в кнопку нельзя, поэтому «Это про меня» это span.
 *
 * Подписи «Это про меня» и «Свернуть» (openLabel и closeLabel в глобале
 * Home) больше не выводятся: выбранная карточка видна по рамке, а
 * сворачивать нечего. Оба поля в CMS остались без потребителей — убрать
 * при следующей правке схемы.
 */
export default function StateCards({
  title,
  lead,
  criteriaTitle,
  solutionLabel,
  items,
  footerText,
  footerButton,
  phone,
  phoneRaw,
}: Props) {
  const [active, setActive] = useState(0)
  const baseId = useId()
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([])

  if (!items.length) return null

  const current = items[active] ?? items[0]
  const panelId = `${baseId}-panel`
  const tabId = (i: number) => `${baseId}-tab-${i}`
  const num = (i: number) => String(i + 1).padStart(2, '0')

  /* Стрелки переносят и выбор, и фокус: у вкладок с автоматической
     активацией это одно действие, иначе с клавиатуры видно рамку на одной
     карточке, а содержимое от другой */
  const select = (i: number) => {
    const next = (i + items.length) % items.length
    setActive(next)
    tabsRef.current[next]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const moves: Record<string, number> = {
      ArrowDown: i + 1,
      ArrowRight: i + 1,
      ArrowUp: i - 1,
      ArrowLeft: i - 1,
      Home: 0,
      End: items.length - 1,
    }

    const next = moves[event.key]
    if (next === undefined) return

    event.preventDefault()
    select(next)
  }

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <h2 className={styles.title} id={`${baseId}-title`}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <div className={styles.layout}>
        <ul
          className={styles.tabs}
          role="tablist"
          aria-orientation="vertical"
          aria-labelledby={`${baseId}-title`}
        >
          {items.map((item, i) => {
            const selected = active === i

            return (
              <li key={item.title} className={styles.cell} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  ref={(el) => {
                    tabsRef.current[i] = el
                  }}
                  className={styles.card}
                  data-selected={selected || undefined}
                  aria-selected={selected}
                  aria-controls={panelId}
                  // Внутри вкладок таб-остановка одна: активная вкладка
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  onKeyDown={(event) => onKeyDown(event, i)}
                >
                  <span className={styles.head}>
                    <span className={styles.number} aria-hidden="true">
                      {num(i)}
                    </span>
                    <span className={styles.cardTitle}>{item.title}</span>
                  </span>

                  <span className={styles.description}>{item.description}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div
          className={styles.panel}
          id={panelId}
          role="tabpanel"
          aria-labelledby={tabId(active)}
          // Панель фокусируемая: в ней бывает текст без ссылок, и с
          // клавиатуры до него иначе не добраться
          tabIndex={0}
        >
          {/* key перезапускает появление при каждой смене состояния */}
          <div className={styles.panelFade} key={active}>
            <div className={styles.panelHead}>
              <span className={styles.number} aria-hidden="true">
                {num(active)}
              </span>
              <h3 className={styles.panelTitle}>{current.title}</h3>
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
