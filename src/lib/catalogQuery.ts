'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Поисковый запрос каталога (?q=) как внешнее хранилище для React.
 *
 * Зачем так, а не useSearchParams. Страницы каталога статические, и
 * useSearchParams на статической странице заставляет Next отрезать всё
 * до ближайшего Suspense и рендерить это только в браузере — список
 * сервисов выпал бы из готового HTML, а его читают поисковики. Здесь
 * серверный снимок всегда пустой: в HTML попадает полный список, а
 * фильтр из адресной строки применяется уже после гидратации.
 *
 * Адрес меняется через history.replaceState, а не router.replace: Next
 * патчит history и сам синхронизирует свой роутер, серверу при этом ничего
 * не отправляется. Слушатели уведомляются вручную — replaceState событий
 * не даёт, popstate стреляет только на «назад» и «вперёд».
 *
 * Значение кэшируется, а не читается из адреса при каждом рендере: попап
 * сервиса подменяет адрес на /services/<категория>/<слаг> в обход роутера
 * Next (см. ServiceModalProvider), и без кэша список за попапом терял бы
 * фильтр. Кэш привязан к pathname из usePathname — его попап не трогает,
 * а переход по ссылке сайдбара меняет, и адрес перечитывается заново.
 * Ещё перечитывается на popstate: «назад» из попапа ведёт на каталожный
 * адрес, и там ?q= снова на месте.
 */

const listeners = new Set<() => void>()
let cached = ''
let cachedFor: string | null = null

function readFromUrl() {
  return new URLSearchParams(window.location.search).get('q') ?? ''
}

function notify() {
  listeners.forEach((listener) => listener())
}

function onPopState() {
  cached = readFromUrl()
  cachedFor = window.location.pathname
  notify()
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) window.addEventListener('popstate', onPopState)
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) window.removeEventListener('popstate', onPopState)
  }
}

function snapshotFor(pathname: string) {
  if (cachedFor !== pathname) {
    cachedFor = pathname
    cached = readFromUrl()
  }
  return cached
}

function getServerSnapshot() {
  return ''
}

export function useCatalogQuery() {
  const pathname = usePathname()
  const getSnapshot = useCallback(() => snapshotFor(pathname), [pathname])
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  /* Сверка после перехода роутера. usePathname меняется уже в рендере, а
     адресную строку Next обновляет позже, при коммите — и снимок на этом
     рендере прочитал бы ещё старый адрес с прежним ?q=. Эффект идёт после
     коммита, адрес к этому моменту новый */
  useEffect(() => {
    const fresh = readFromUrl()
    if (fresh !== cached) {
      cached = fresh
      cachedFor = pathname
      notify()
    }
  }, [pathname])

  return value
}

/* Строка пишется как есть, без trim: пробел на конце — это «слово ещё не
   дописано», и срезать его из-под пальцев нельзя. Обрезает matchesQuery */
export function setCatalogQuery(q: string) {
  cached = q

  const url = new URL(window.location.href)
  if (q) url.searchParams.set('q', q)
  else url.searchParams.delete('q')
  if (url.href !== window.location.href) {
    window.history.replaceState(null, '', url)
  }

  notify()
}

/** Фильтр каталога: по названию, заголовку-выгоде и описанию, без учёта регистра */
export function matchesQuery(
  service: { title: string; headline: string; description: string },
  q: string,
) {
  const needle = q.trim().toLowerCase()
  if (!needle) return true
  return [service.title, service.headline, service.description]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}
