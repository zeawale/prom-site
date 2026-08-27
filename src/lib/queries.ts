import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Service } from '@/payload-types'

/** Общий фильтр видимости. Используется во ВСЕХ выборках сервисов. */
export const VISIBLE: Where = { isHidden: { not_equals: true } }

export async function getSettings() {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'settings' })
}

export type SidebarItem = {
  slug: string
  title: string
  icon?: string | null
  count: number
  href: string
}

export async function getSidebar(services?: Service[]): Promise<{
  flags: SidebarItem[]
  categories: SidebarItem[]
  total: number
}> {
  const payload = await getPayload({ config })

  const { docs: cats } = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'order',
    pagination: false,
  })

  const list =
    services ??
    (
      await payload.find({
        collection: 'services',
        where: VISIBLE,
        limit: 0,
        depth: 1,
        pagination: false,
      })
    ).docs

  const countBy = (fn: (s: Service) => boolean) => list.filter(fn).length

  const flags: SidebarItem[] = [
    {
      slug: 'popular',
      title: 'Популярное',
      icon: 'chart',
      count: countBy((s) => s.isPopular === true),
      href: '/services/popular',
    },
    {
      slug: 'new',
      title: 'Новинки',
      icon: 'sparkle',
      count: countBy((s) => s.isNew === true),
      href: '/services/new',
    },
  ].filter((f) => f.count > 0)

  const categories: SidebarItem[] = cats.map((c) => ({
    slug: c.slug,
    title: c.title,
    icon: c.icon,
    count: countBy(
      (s) => typeof s.category === 'object' && s.category?.slug === c.slug,
    ),
    href: `/services/${c.slug}`,
  }))

  return { flags, categories, total: list.length }
}