'use client'

import { useServiceModal } from '@/components/catalog/ServiceModalProvider'
import styles from './TariffServiceLink.module.css'

type Props = {
  slug: string
  categorySlug: string
  children: React.ReactNode
}

export function TariffServiceLink({ slug, categorySlug, children }: Props) {
  const { open } = useServiceModal()

  return (
    <button type="button" className={styles.link} onClick={() => open(categorySlug, slug)}>
      {children}
    </button>
  )
}
