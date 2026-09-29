'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { Service } from '@/payload-types'
import { Modal } from './Modal'
import { ServiceDetailClient } from './ServiceDetailClient'

type Ctx = { open: (categorySlug: string, slug: string) => void }

const ModalCtx = createContext<Ctx | null>(null)

/** Меняет адрес, не задевая роутер Next (он патчит window.history.pushState) */
function silentPush(url: string) {
  History.prototype.pushState.call(window.history, null, '', url)
}

/** То же, но поверх текущей записи истории — для попапа, открытого из попапа */
function silentReplace(url: string) {
  History.prototype.replaceState.call(window.history, null, '', url)
}

export function useServiceModal() {
  const ctx = useContext(ModalCtx)
  if (!ctx) throw new Error('useServiceModal вызван вне ServiceModalProvider')
  return ctx
}

export function ServiceModalProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  /* Адрес каталога до открытия попапа. Ref, а не state: open читает его
     синхронно, чтобы отличить первый попап от вложенного, а рендеру он
     не нужен */
  const prevUrl = useRef<string | null>(null)

  const close = useCallback(() => {
    setService(null)
    setLoading(false)
    if (prevUrl.current !== null) {
      silentPush(prevUrl.current)
      prevUrl.current = null
    }
  }, [])

  const open = useCallback(async (categorySlug: string, slug: string) => {
    const url = `/services/${categorySlug}/${slug}`
    if (prevUrl.current === null) {
      prevUrl.current = window.location.pathname + window.location.search
      silentPush(url)
    } else {
      /* Вложенный попап («часто берут вместе») — та же запись истории.
         Иначе каждый попап добавлял бы по записи, «назад» закрывало окно
         на первом же шаге, а в адресной строке оставался предыдущий
         сервис, и обновление страницы открывало его отдельной страницей */
      silentReplace(url)
    }
    setLoading(true)

    try {
      const res = await fetch(`/api/services?where[slug][equals]=${slug}&depth=2&limit=1`)
      const data = await res.json()
      setService(data.docs?.[0] ?? null)
    } catch {
      setService(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Кнопка «назад» в браузере закрывает попап
  useEffect(() => {
    const onPop = () => {
      setService(null)
      setLoading(false)
      prevUrl.current = null
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <ModalCtx.Provider value={{ open }}>
      {children}
      {(loading || service) && (
        <Modal onClose={close}>
          {service ? (
            <ServiceDetailClient service={service} />
          ) : (
            <p style={{ padding: 48, textAlign: 'center' }}>Загрузка…</p>
          )}
        </Modal>
      )}
    </ModalCtx.Provider>
  )
}
