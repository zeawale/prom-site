'use client'

import { useId, useState, type ReactNode } from 'react'
import styles from './TariffTable.module.css'

type Props = {
  label: string
  /** Сколько колонок в таблице — для colSpan строки-кнопки */
  colSpan: number
  /** Строки «Детально». Приходят серверными — см. комментарий ниже */
  children: ReactNode
}

/**
 * Единственный клиентский кусок таблицы.
 *
 * children приходят уже отрендеренными на сервере — тот же приём, что с
 * LeadModalProvider в layout. Поэтому 41 строка «Детально» у УТ не гидратируется:
 * в браузер едет только кнопка и её состояние.
 *
 * Строки прячутся атрибутом hidden на <tbody>, а не размонтированием.
 * Размонтирование выкинуло бы их из DOM, и поисковик не увидел бы половину
 * таблицы — а это ровно тот контент, ради которого страница существует.
 */
export default function TariffDetails({ label, colSpan, children }: Props) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  return (
    <>
      <tbody>
        <tr>
          <td colSpan={colSpan} className={styles.detailsCell}>
            <button
              type="button"
              className={styles.detailsToggle}
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setOpen((v) => !v)}
            >
              <span>{label}</span>
              {/* Шеврон декоративный: состояние уже объявлено через aria-expanded */}
              <svg
                className={styles.chevron}
                data-open={open || undefined}
                viewBox="0 0 24 24"
                width="20"
                height="20"
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
          </td>
        </tr>
      </tbody>

      <tbody id={bodyId} hidden={!open}>
        {children}
      </tbody>
    </>
  )
}