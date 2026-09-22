import type { CSSProperties } from 'react'
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
function Cell({ cell, label }: { cell: TariffCell; label: string }) {
  /* data-label — подпись колонки для телефона: там шапка таблицы спрятана,
     и у каждой ячейки над значением рисуется «ПРОФ» / «ТЕХНО» из CSS.
     role="cell" — см. комментарий у <table> */
  if (cell.value === 'text') {
    return (
      <td className={styles.cellText} data-label={label} role="cell">
        {cell.text}
      </td>
    )
  }

  const yes = cell.value === 'yes'

  return (
    <td className={styles.cell} data-label={label} role="cell">
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

function Rows({ rows, columns }: { rows: TariffRow[]; columns: string[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <tr
          key={i}
          role="row"
          // Строка с текстовыми значениями («100 комплектов документов»)
          // на телефоне раскладывается иначе, чем строка с галочками, —
          // см. TariffTable.module.css
          data-text={row.cells.some((cell) => cell.value === 'text') || undefined}
        >
          <th scope="row" className={styles.rowLabel} role="rowheader">
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
            <Cell key={j} cell={cell} label={columns[j] ?? ''} />
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
        {/* Явные роли на всех уровнях таблицы — не дубль. На телефоне
            строки перестраиваются через display: block / grid, и Safari
            с Firefox при смене display выкидывают у элементов табличную
            семантику: скринридер перестаёт читать таблицу таблицей.
            Роли возвращают её независимо от CSS */}
        <table
          className={styles.table}
          role="table"
          style={{ '--cols': columns.length } as CSSProperties}
        >
          <colgroup>
            <col />
            {columns.map((_, i) => (
              <col key={i} className={styles.colValue} />
            ))}
          </colgroup>

          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" className={styles.headFirst} role="columnheader">
                {firstColumnLabel}
              </th>
              {columns.map((label) => (
                <th key={label} scope="col" className={styles.headValue} role="columnheader">
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody role="rowgroup">
            <Rows rows={rows} columns={columns} />
          </tbody>

          {details && details.rows.length > 0 && (
            <TariffDetails label={details.label} colSpan={colSpan}>
              <Rows rows={details.rows} columns={columns} />
            </TariffDetails>
          )}
        </table>
      </div>

      {disclaimer && <p className={styles.disclaimer}>{disclaimer}</p>}
    </section>
  )
}
