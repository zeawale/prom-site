'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Service } from '@/payload-types'
import { Modal } from './Modal'
import { ServiceDetailClient } from './ServiceDetailClient'

type Ctx = { open: (categorySlug: string, slug: string) => void }

const ModalCtx = createContext<Ctx | null>(null)

/** Меняет адрес, не задевая роутер Next (он патчит window.history.pushState) */
function silentPush(url: string) {
  History.prototype.pushState.call(window.history, null, '', url)
}

export function useServiceModal() {
  const ctx = useContext(ModalCtx)
  if (!ctx) throw new Error('useServiceModal вызван вне ServiceModalProvider')
  return ctx
}

export function ServiceModalProvider({ children }: { children: React.ReactNode }) {
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(false)
  const [prevUrl, setPrevUrl] = useState<string | null>(null)

   const close = useCallback(() => {
    setService(null)
    setLoading(false)
    if (prevUrl) {
      silentPush(prevUrl)
      setPrevUrl(null)
    }
  }, [prevUrl])

  const open = useCallback(async (categorySlug: string, slug: string) => {
    setPrevUrl((cur) => cur ?? window.location.pathname + window.location.search)
    setLoading(true)
    silentPush(`/services/${categorySlug}/${slug}`)

    try {
      const res = await fetch(
        `/api/services?where[slug][equals]=${slug}&depth=2&limit=1`,
      )
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
      setPrevUrl(null)
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