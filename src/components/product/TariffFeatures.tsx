'use client'

import { useId, useState, type ReactNode } from 'react'
import styles from './TariffCards.module.css'

/**
 * Список «Что входит» в карточке тарифа Фреша, свёрнутый на телефоне.
 *
 * На десктопе кнопки нет и список всегда раскрыт — это решает CSS, а не
 * проверка ширины в JS: иначе сервер не знал бы, что рендерить, и карточка
 * мигала бы при гидратации.
 *
 * Список приходит детьми и отрендерен на сервере — тот же приём, что у
 * TariffDetails. Свёрнутый прячется display: none, а не размонтированием:
 * поисковик должен видеть состав тарифа целиком.
 */
export default function TariffFeatures({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  return (
    <div className={styles.featuresWrap} data-open={open || undefined}>
      <button
        type="button"
        className={styles.featuresToggle}
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{open ? 'Свернуть' : 'Что входит'}</span>
        <svg
          className={styles.featuresChevron}
          viewBox="0 0 24 24"
          width="18"
          height="18"
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

      <div id={bodyId} className={styles.featuresBody}>
        {children}
      </div>
    </div>
  )
}
