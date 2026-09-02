/**
 * Клиентобезопасное. Никаких обращений к базе — только чистые функции.
 * Здесь живёт перекладывание модели хранения (col1/col2/col3) в модель UI (cells[]).
 *
 * Зачем разделение: фиксированные колонки — это ограничение Payload, а не таблицы.
 * Компонент про них знать не должен, иначе добавление четвёртой колонки
 * (если такое когда-нибудь случится) придётся править в двух местах.
 */

export type CellValue = 'yes' | 'no' | 'text'

export type TariffCell = {
  value: CellValue
  /** Заполняется только при value === 'text' */
  text?: string
}

export type TariffRow = {
  label: string
  cells: TariffCell[]
}

/** Форма строки, как она лежит в JSON и в Payload */
export type StoredRow = {
  label: string
  col1?: CellValue | null
  col1Text?: string | null
  col2?: CellValue | null
  col2Text?: string | null
  col3?: CellValue | null
  col3Text?: string | null
  /** snake_case-варианты из JSON-мока */
  col1_text?: string | null
  col2_text?: string | null
  col3_text?: string | null
}

/**
 * Разворачивает строку хранения в массив ячеек нужной длины.
 * columnCount — сколько колонок реально рендерится (2 или 3).
 * Лишние значения игнорируются: если col3Label пуст, col3 не читается вовсе.
 */
export const toCells = (row: StoredRow, columnCount: number): TariffCell[] => {
  const raw = [
    { value: row.col1, text: row.col1Text ?? row.col1_text },
    { value: row.col2, text: row.col2Text ?? row.col2_text },
    { value: row.col3, text: row.col3Text ?? row.col3_text },
  ].slice(0, columnCount)

  return raw.map(({ value, text }) => ({
    // Невыставленное значение трактуем как «нет».
    // В SQLite незаполненный select — NULL, а не пустая строка.
    value: value ?? 'no',
    text: text ?? undefined,
  }))
}

export const toRows = (rows: StoredRow[], columnCount: number): TariffRow[] =>
  rows.map((row) => ({ label: row.label, cells: toCells(row, columnCount) }))