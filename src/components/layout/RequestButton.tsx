'use client'

import { useLeadModal } from '@/components/lead/LeadModalProvider'

type Props = {
  className?: string
  source: string
  children?: React.ReactNode
}

export function RequestButton({ className, source, children = 'Оставить заявку' }: Props) {
  const { open } = useLeadModal()

  return (
    <button type="button" className={className} onClick={() => open(source)}>
      {children}
    </button>
  )
}