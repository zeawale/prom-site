'use client'

import { useState } from 'react'
import styles from './OfficeMap.module.css'

type Props = {
  url: string
  plaque?: string | null
  buttonLabel?: string | null
  note?: string | null
  /** Адрес текстом — он же подпись к карте для скринридера */
  address: string
}

/**
 * Карта офиса — виджет Яндекс.Карт, который грузится только по нажатию.
 *
 * Iframe не стоит в разметке сразу намеренно. Виджет тянется с серверов
 * Яндекса и ставит свои cookie, то есть до согласия посетителя его быть
 * не должно. Пока кнопку не нажали, к Яндексу не уходит ни одного
 * запроса: в DOM нет ни iframe, ни ссылки на его домен.
 *
 * Согласие здесь одноразовое, на текущий просмотр, и нигде не хранится.
 * Когда появится сквозной cookie-баннер, эту заглушку надо подружить с
 * ним: карта должна открываться сразу, если аналитические cookie уже
 * разрешены. До тех пор явное нажатие — самый честный вариант.
 *
 * loading="lazy" на iframe оставлен, хотя он уже за кнопкой: браузер всё
 * равно не начнёт грузить виджет, пока карта не окажется во вьюпорте.
 */
export default function OfficeMap({ url, plaque, buttonLabel, note, address }: Props) {
  const [shown, setShown] = useState(false)

  return (
    <div className={styles.frame}>
      {shown ? (
        <iframe
          className={styles.map}
          src={url}
          title={`Карта проезда: ${address}`}
          loading="lazy"
          allowFullScreen
        />
      ) : (
        <div className={styles.stub}>
          {note && <p className={styles.note}>{note}</p>}
          <button type="button" className={styles.button} onClick={() => setShown(true)}>
            {buttonLabel ?? 'Показать карту'}
          </button>
        </div>
      )}

      {plaque && <p className={styles.plaque}>{plaque}</p>}
    </div>
  )
}
