'use client'

import styles from './SearchInput.module.css'

type Props = {
  value: string
  onChange: (value: string) => void
}

/**
 * Поле поиска по каталогу. Само состояния не держит: значение и обработчик
 * приходят из CatalogResults, где живут и фильтр, и запись ?q= в адрес.
 */
export function SearchInput({ value, onChange }: Props) {
  return (
    <div className={styles.wrap}>
      <input
        type="search"
        className={styles.input}
        placeholder="Поиск по сервисам"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Поиск по каталогу сервисов"
      />
    </div>
  )
}
