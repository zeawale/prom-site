'use client'

import Link from 'next/link'
import type { TariffService } from '@/lib/programs'
import { useServiceModal } from '@/components/catalog/ServiceModalProvider'
import styles from './TariffServiceLink.module.css'

type Props = {
  /** Карточка каталога — клик открывает попап. Приоритетнее href */
  service?: TariffService
  /** Обычная ссылка на страницу сайта — для строк, которых в каталоге нет */
  href?: string
  children: React.ReactNode
}

/**
 * Кликабельная первая ячейка строки тарифной таблицы. Два режима, потому что
 * визуально это одно и то же — подчёркнутое название сервиса, — а различие
 * только в том, куда ведёт клик. Разводить на два компонента значило бы
 * дублировать стили и следить, чтобы они не разъехались.
 *
 * Компонент клиентский из-за попапа, поэтому вызывать его на строках без
 * ссылки нельзя: у таблицы «Управление торговлей» 49 строк, и все они
 * поехали бы в бандл ради ничего. Проверку делает TariffTable.
 */
export function TariffServiceLink({ service, href, children }: Props) {
  // Хук безусловный — правило хуков. Ветвление ниже.
  const { open } = useServiceModal()

  if (service) {
    return (
      <button
        type="button"
        className={styles.link}
        onClick={() => open(service.categorySlug, service.slug)}
      >
        {children}
      </button>
    )
  }

  if (href) {
    return (
      <Link href={href} className={styles.link}>
        {children}
      </Link>
    )
  }

  return <>{children}</>
}
