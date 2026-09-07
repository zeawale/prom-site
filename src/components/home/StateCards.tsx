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
 * «Где вы сейчас» — четыре состояния, каждое раскрывается по клику.
 *
 * Открыто может быть только одно: это диагностика, посетитель выбирает
 * свою ситуацию, а не сравнивает четыре сразу. Раскрытая карточка
 * занимает обе колонки — иначе признаки и решения не помещаются рядом.
 *
 * Клиентский компонент здесь неизбежен, но он тонкий: весь текст
 * приходит пропами со страницы, в базу компонент не ходит.
 *
 * <details>/<summary> не подошли: закрывать соседнюю карточку при
 * открытии текущей всё равно пришлось бы состоянием, а полноширинное
 * раскрытие ломает нативную анимацию. Кнопка с aria-expanded и
 * aria-controls даёт ровно ту же семантику явно.
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
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  if (!items.length) return null

  return (
    <section className={styles.section} aria-labelledby={`${baseId}-title`}>
      <h2 className={styles.title} id={`${baseId}-title`}>
        {title}
      </h2>
      {lead && <p className={styles.lead}>{lead}</p>}

      <ul className={styles.grid}>
        {items.map((item, i) => {
          const open = openIndex === i
          const panelId = `${baseId}-panel-${i}`
          const number = String(i + 1).padStart(2, '0')

          return (
            <li key={item.title} className={styles.card} data-open={open || undefined}>
              <div className={styles.head}>
                <span className={styles.number} aria-hidden="true">
                  {number}
                </span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
              </div>

              {!open && <p className={styles.description}>{item.description}</p>}

              {open && (
                <div className={styles.panel} id={panelId}>
                  <div className={styles.criteria}>
                    <p className={styles.criteriaTitle}>{criteriaTitle}</p>
                    <ul className={styles.criteriaList}>
                      {item.criteria.map((text) => (
                        <li key={text} className={styles.criteriaItem}>
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.solutions}>
                    {item.solutions.map((solution) => (
                      <div key={solution.href + solution.title} className={styles.solution}>
                        <div className={styles.solutionHead}>
                          <p className={styles.eyebrow}>{solution.eyebrow}</p>
                          <Link href={solution.href} className={styles.solutionLink}>
                            {solutionLabel}
                            {/* Название продукта повторяется для скринридера:
                                четыре кнопки «Перейти» подряд вне контекста
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
              )}

              <button
                type="button"
                className={styles.toggle}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                onClick={() => setOpenIndex(open ? null : i)}
              >
                {open ? closeLabel : openLabel}
              </button>
            </li>
          )
        })}
      </ul>

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
