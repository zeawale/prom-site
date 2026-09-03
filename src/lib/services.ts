import type { Service } from '@/payload-types'

/**
 * Отсекает скрытые сервисы из связанных.
 * Чистая функция без обращений к базе — безопасна в клиентских компонентах.
 */
export function visibleRelated(related: Service['related']): Service[] {
  if (!related) return []
  return related.filter(
    (r): r is Service => typeof r === 'object' && r !== null && r.isHidden !== true,
  )
}
