'use client'

import { useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import {
  readCookieConsent,
  serverCookieConsent,
  subscribeCookieConsent,
  writeCookieConsent,
} from '@/lib/cookieConsent'
import { CookieSettings } from './CookieSettings'
import styles from './CookieConsent.module.css'

export type CookieCategoryText = { label: string; text: string }

export type CookieTexts = {
  version: string
  title: string
  text: string
  policyLabel: string
  acceptAllLabel: string
  necessaryOnlyLabel: string
  settingsLabel: string
  settings: {
    title: string
    necessary: CookieCategoryText
    analytics: CookieCategoryText
    functional: CookieCategoryText
    saveLabel: string
    acceptAllLabel: string
  }
}

type Props = { texts: CookieTexts }

/**
 * «Гидратация уже прошла?» без useEffect.
 *
 * useSyncExternalStore на сервере и на первом клиентском рендере берёт
 * серверный снимок (false), а сразу после гидратации переключается на
 * клиентский (true). Ровно то же, что давала пара useState + useEffect,
 * но без записи состояния из эффекта: React 19 справедливо ругается на
 * неё как на каскадный рендер.
 *
 * Функции лежат в модуле, а не в теле хука: подписка обязана быть
 * стабильной по ссылке, иначе React переподписывается каждый рендер.
 */
const noopSubscribe = () => () => {}
const onClient = () => true
const onServer = () => false

const useIsHydrated = () => useSyncExternalStore(noopSubscribe, onClient, onServer)

/**
 * Плашка согласия на cookie.
 *
 * Показывается, пока посетитель не ответил, — и снова, если сменилась
 * версия условий: согласие на прежний состав категорий к новому не
 * относится.
 *
 * Три юридических требования зашиты в код, а не в CMS:
 *  — кнопка отказа того же размера и веса, что кнопка принятия. Разный
 *    вес превращает «выбор» в подталкивание, и это ровно то, за что
 *    штрафуют;
 *  — всё, кроме необходимых, выключено по умолчанию: согласие бывает
 *    только явным, преднажатая галочка согласием не считается;
 *  — до ответа ни один сторонний ресурс не грузится. Не «скрипт стоит,
 *    но молчит», а его нет в DOM.
 *
 * Проверка на гидратацию нужна из-за SSG: страницы собраны заранее, и в
 * готовом HTML согласия нет и быть не может. Без неё баннер попадал бы в
 * статику и мигал на каждой загрузке у всех, кто уже ответил.
 */
export function CookieConsent({ texts }: Props) {
  const stored = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    serverCookieConsent,
  )

  const hydrated = useIsHydrated()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const save = (analytics: boolean, functional: boolean) => {
    writeCookieConsent({ version: texts.version, analytics, functional })
    setSettingsOpen(false)
  }

  const answered = stored !== null && stored.version === texts.version

  if (!hydrated) return null
  if (answered && !settingsOpen) return null

  return (
    <>
      <div className={styles.banner} role="region" aria-label={texts.title}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <p className={styles.title}>{texts.title}</p>
            <p className={styles.text}>{texts.text}</p>
            <Link href="/cookie" className={styles.policy}>
              {texts.policyLabel}
            </Link>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.accept} onClick={() => save(true, true)}>
              {texts.acceptAllLabel}
            </button>
            <button type="button" className={styles.reject} onClick={() => save(false, false)}>
              {texts.necessaryOnlyLabel}
            </button>
            <button
              type="button"
              className={styles.settingsButton}
              onClick={() => setSettingsOpen(true)}
            >
              {texts.settingsLabel}
            </button>
          </div>
        </div>
      </div>

      {settingsOpen && (
        <CookieSettings
          texts={texts.settings}
          onSave={save}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </>
  )
}
