'use client'

import { useId, useState } from 'react'
import { RequestButton } from '@/components/layout/RequestButton'
import styles from './MoreTariffs.module.css'

export type ExtraTariff = {
  name: string
  specs: string
  text: string
  note?: string | null
}

type Props = {
  title: string
  items: ExtraTariff[]
  bannerText: string
  buttonLabel: string
}

/**
 * Раскрывашка «Ещё три тарифа». Паттерн взят у TariffDetails: содержимое
 * прячется атрибутом hidden, а не размонтированием — иначе поисковик
 * не увидит три тарифа из пяти, а это тот же контент, ради которого
 * страница существует.
 *
 * В отличие от TariffDetails содержимое здесь клиентское: карточки простые,
 * прокидывать их через children ради экономии на гидратации трёх абзацев
 * значило бы усложнить вызов на ровном месте.
 */
export default function MoreTariffs({ title, items, bannerText, buttonLabel }: Props) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  if (!items.length) return null

  return (
    <section className={styles.wrap}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.triggerTitle}>{title}</span>
        <svg
          className={styles.chevron}
          data-open={open || undefined}
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div id={bodyId} hidden={!open} className={styles.body}>
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <li key={i} className={styles.card}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.specs}>{item.specs}</p>
              <p className={styles.text}>{item.text}</p>
              {item.note && <p className={styles.note}>{item.note}</p>}
            </li>
          ))}
        </ul>

        <div className={styles.banner}>
          <p className={styles.bannerText}>{bannerText}</p>
          <RequestButton source="fresh" className={styles.bannerButton}>
            {buttonLabel}
          </RequestButton>
        </div>
      </div>
    </section>
  )
}
