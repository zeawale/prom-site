import type { TariffCell, TariffRow } from '@/lib/programs'
import TariffDetails from './TariffDetails'
import { TariffServiceLink } from './TariffServiceLink'
import styles from './TariffTable.module.css'

export type TariffTableProps = {
  /** Уникальный идентификатор для связи заголовка с таблицей. Обычно слаг программы */
  id: string
  title?: string | null
  /** «Возможности», «По подсистемам», «Сервисы ИТС» */
  firstColumnLabel: string
  /** 2 или 3 названия: БАЗОВАЯ / ПРОФ / КОРП */
  columns: string[]
  rows: TariffRow[]
  details?: { label: string; rows: TariffRow[] } | null
  /** Общий текст из глобала ProgramsSection */
  disclaimer?: string | null
}

/** Пустой чекбокс как «нет» — принятое решение Ники, визуал из макета.
 *  Текстовая альтернатива для скринридера добавлена: она невидима и макет
 *  не трогает, но без неё незрячий пользователь читает строку без значения. */
function Cell({ cell }: { cell: TariffCell }) {
  if (cell.value === 'text') {
    return <td className={styles.cellText}>{cell.text}</td>
  }

  const yes = cell.value === 'yes'

  return (
    <td className={styles.cell}>
      <span className={styles.box} data-yes={yes || undefined} aria-hidden="true">
        {yes && (
          <svg viewBox="0 0 24 24" width="14" height="14" focusable="false">
            <path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className={styles.srOnly}>{yes ? 'Есть' : 'Нет'}</span>
    </td>
  )
}

function Rows({ rows }: { rows: TariffRow[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <tr key={i}>
          <th scope="row" className={styles.rowLabel}>
            {/* Ссылки есть только у строк /its: либо попап карточки каталога,
                либо адрес страницы сайта. У программ первая колонка — это
                возможности, ссылаться не на что, и клиентский компонент
                на такие строки не вешается вовсе */}
            {row.service || row.href ? (
              <TariffServiceLink service={row.service} href={row.href}>
                {row.label}
              </TariffServiceLink>
            ) : (
              row.label
            )}
          </th>
          {row.cells.map((cell, j) => (
            <Cell key={j} cell={cell} />
          ))}
        </tr>
      ))}
    </>
  )
}

export default function TariffTable({
  id,
  title,
  firstColumnLabel,
  columns,
  rows,
  details,
  disclaimer,
}: TariffTableProps) {
  const headingId = `tariff-${id}`
  const colSpan = columns.length + 1

  return (
    <section className={styles.section} aria-labelledby={title ? headingId : undefined}>
      {title && (
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
      )}

      {/* Обёртка со скроллом. tabIndex ставится только когда скролл реально есть —
          иначе в таб-порядок попадает блок, который никуда не прокручивается.
          На десктопе таблица помещается целиком, скролл включается медиазапросом. */}
      <div className={styles.scroller} role="region" aria-labelledby={headingId} tabIndex={0}>
        <table className={styles.table}>
          <colgroup>
            <col />
            {columns.map((_, i) => (
              <col key={i} className={styles.colValue} />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th scope="col" className={styles.headFirst}>
                {firstColumnLabel}
              </th>
              {columns.map((label) => (
                <th key={label} scope="col" className={styles.headValue}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <Rows rows={rows} />
          </tbody>

          {details && details.rows.length > 0 && (
            <TariffDetails label={details.label} colSpan={colSpan}>
              <Rows rows={details.rows} />
            </TariffDetails>
          )}
        </table>
      </div>

      {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
    </section>
  )
}
