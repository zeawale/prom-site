'use client'

import { useState, useSyncExternalStore } from 'react'
import {
  allows,
  readCookieConsent,
  serverCookieConsent,
  subscribeCookieConsent,
} from '@/lib/cookieConsent'
import styles from './OfficeMap.module.css'

type Props = {
  url: string
  plaque?: string | null
  buttonLabel?: string | null
  note?: string | null
  /** Адрес текстом — он же подпись к карте для скринридера */
  address: string
  /** Версия согласия из глобала CookieBanner: согласие на прежние условия к новым не относится */
  consentVersion: string
}

/**
 * Карта офиса — виджет Яндекс.Карт.
 *
 * Карта открывается сама, если посетитель разрешил функциональные cookie:
 * флаг общий с cookie-баннером и живёт в lib/cookieConsent. Заглушка с
 * кнопкой остаётся только для двух случаев — ответа на баннер ещё не было
 * или он был отрицательным.
 *
 * Категория именно функциональная, а не аналитическая: виджет не считает
 * посещения, он часть содержимого страницы. Поэтому в описании категории
 * в CMS прямо сказано про встроенную карту — иначе посетитель разрешает
 * «запоминать настройки», а получает вдобавок запрос к Яндексу.
 *
 * Iframe не стоит в разметке безусловно намеренно: виджет тянется с
 * серверов Яндекса и ставит свои cookie, то есть до согласия его быть не
 * должно. Пока согласия нет и кнопку не нажали, к Яндексу не уходит ни
 * одного запроса — в DOM нет ни iframe, ни ссылки на его домен.
 *
 * Нажатие кнопки — согласие ровно на этот просмотр: оно НЕ пишется в
 * хранилище. Отказ на баннере не должен молча превращаться в постоянное
 * разрешение из-за одного клика по карте.
 *
 * loading="lazy" оставлен, хотя iframe появляется уже после решения:
 * браузер всё равно не начнёт грузить виджет, пока карта не окажется во
 * вьюпорте.
 */
export default function OfficeMap({
  url,
  plaque,
  buttonLabel,
  note,
  address,
  consentVersion,
}: Props) {
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    serverCookieConsent,
  )

  /* Разовое согласие «показать сейчас», поверх сохранённого решения */
  const [openedByClick, setOpenedByClick] = useState(false)

  const shown = allows(consent, 'functional', consentVersion) || openedByClick

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
          <button
            type="button"
            className={styles.button}
            onClick={() => setOpenedByClick(true)}
          >
            {buttonLabel ?? 'Показать карту'}
          </button>
        </div>
      )}

      {plaque && <p className={styles.plaque}>{plaque}</p>}
    </div>
  )
}
