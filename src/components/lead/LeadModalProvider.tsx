'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import { LeadModal } from './LeadModal'

type Ctx = {
  open: (source: string) => void
  close: () => void
}

const LeadModalContext = createContext<Ctx | null>(null)

export function useLeadModal() {
  const ctx = useContext(LeadModalContext)
  if (!ctx) {
    throw new Error('useLeadModal используется вне LeadModalProvider')
  }
  return ctx
}

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const [source, setSource] = useState<string | null>(null)

  const open = useCallback((s: string) => setSource(s), [])
  const close = useCallback(() => setSource(null), [])

  return (
    <LeadModalContext.Provider value={{ open, close }}>
      {children}
      {source !== null && <LeadModal source={source} onClose={close} />}
    </LeadModalContext.Provider>
  )
}
