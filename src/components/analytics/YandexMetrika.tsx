'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import {
  allows,
  readCookieConsent,
  serverCookieConsent,
  subscribeCookieConsent,
} from '@/lib/cookieConsent'

type Ym = ((id: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[][]
  l?: number
}

declare global {
  interface Window {
    ym?: Ym
  }
}

type Props = {
  /** Номер счётчика из NEXT_PUBLIC_YM_ID. Пусто — Метрики нет вовсе */
  counterId: number | null
  /** Версия согласия из глобала CookieBanner: согласие на прежние условия к новым не относится */
  consentVersion: string
}

const TAG_SRC = 'https://mc.yandex.ru/metrika/tag.js'

/** Счётчик, в который сейчас можно слать события. null — Метрики нет или согласия нет */
let activeCounter: number | null = null

/**
 * Достижение цели Метрики. Цель с тем же идентификатором заводится в
 * интерфейсе Метрики: «Цели» → «JavaScript-событие».
 *
 * Без согласия на аналитику ничего не отправляет: activeCounter
 * выставляет только компонент ниже и только при включённой Метрике.
 */
export function reachGoal(target: string) {
  if (activeCounter === null || !window.ym) return
  window.ym(activeCounter, 'reachGoal', target)
}

/**
 * Яндекс.Метрика под согласие на аналитические cookie.
 *
 * Скрипта нет в разметке: до согласия к Яндексу не уходит ни одного
 * запроса — так и написано в политике cookie (раздел 4). Решение читается
 * из того же хранилища, что у баннера и карты на «Контактах», поэтому
 * Метрика включается сразу после «Принять все», без перезагрузки.
 *
 * Только посещения, ссылки и отказы. Вебвизор и карта кликов выключены:
 * политика обещает обезличенную статистику страниц, времени и источников,
 * а запись действий посетителя — это уже другое обещание.
 *
 * Хиты отправляются руками (`defer: true`) на каждую смену адреса: сайт
 * ходит между страницами без перезагрузки, и сама Метрика увидела бы
 * только первую. Отозвали согласие — новые хиты не уходят; уже
 * загруженный скрипт выгрузить нельзя, он молчит до перезагрузки.
 */
export function YandexMetrika({ counterId, consentVersion }: Props) {
  const consent = useSyncExternalStore(
    subscribeCookieConsent,
    readCookieConsent,
    serverCookieConsent,
  )
  const pathname = usePathname()
  const enabled = counterId !== null && allows(consent, 'analytics', consentVersion)
  const initialized = useRef(false)
  /* Откуда пришли на текущий адрес: первый хит — внешний referrer, дальше — предыдущая страница сайта */
  const lastUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!enabled || counterId === null) {
      activeCounter = null
      return
    }
    activeCounter = counterId

    if (!initialized.current) {
      initialized.current = true
      loadTag()
      window.ym!(counterId, 'init', {
        defer: true,
        trackLinks: true,
        accurateTrackBounce: true,
        clickmap: false,
        webvisor: false,
      })
    }

    const url = window.location.href
    window.ym!(counterId, 'hit', url, { referer: lastUrl.current ?? document.referrer })
    lastUrl.current = url
  }, [enabled, counterId, pathname])

  return null
}

/** Официальный сниппет Метрики: очередь вызовов до загрузки скрипта плюс сам тег */
function loadTag() {
  if (!window.ym) {
    const ym: Ym = (...args) => {
      ;(ym.a = ym.a || []).push(args)
    }
    ym.l = Date.now()
    window.ym = ym
  }

  if (document.querySelector(`script[src="${TAG_SRC}"]`)) return

  const script = document.createElement('script')
  script.async = true
  script.src = TAG_SRC
  document.head.appendChild(script)
}
