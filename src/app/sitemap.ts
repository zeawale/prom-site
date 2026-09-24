import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SITE_URL } from '@/lib/site'
import { VISIBLE } from '@/lib/queries'

/**
 * Карта сайта: /sitemap.xml.
 *
 * Чего здесь нет — и почему:
 *   • /programs — корень раздела редиректит на первую программу;
 *   • /services/new — помечен noindex, пока не расставлен флаг isNew;
 *   • /privacy, /cookie, /consent — noindex, чтобы не конкурировать в
 *     выдаче с продуктовыми страницами;
 *   • скрытые сервисы (isHidden) — их нет и на сайте.
 * Страница с noindex в карте — это противоречивый сигнал поисковику, а не
 * «на всякий случай».
 *
 * lastModified берётся из updatedAt записи: для программ, категорий и
 * сервисов — своей, для статических страниц — глобала, который их
 * наполняет. Дата, которую поисковик может проверить, лучше отсутствия
 * даты; выдуманная «сегодня» хуже обоих.
 *
 * Пересборка раз в час, а не хуками из коллекций: адреса меняются редко
 * (новый сервис или программа), и часовое запаздывание карты ничего не
 * стоит, а вешать ещё один revalidatePath на дюжину хуков — есть чему
 * разойтись.
 */
export const revalidate = 3600

type Entry = MetadataRoute.Sitemap[number]

const url = (path: string) => `${SITE_URL}${path}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [home, about, contacts, its, fresh, grm, programs, categories, services] =
    await Promise.all([
      payload.findGlobal({ slug: 'home', depth: 0 }),
      payload.findGlobal({ slug: 'about', depth: 0 }),
      payload.findGlobal({ slug: 'contacts', depth: 0 }),
      payload.findGlobal({ slug: 'its', depth: 0 }),
      payload.findGlobal({ slug: 'fresh', depth: 0 }),
      payload.findGlobal({ slug: 'grm', depth: 0 }),
      payload.find({ collection: 'programs', limit: 100, depth: 0, pagination: false }),
      payload.find({ collection: 'categories', limit: 100, depth: 0, pagination: false }),
      payload.find({
        collection: 'services',
        where: VISIBLE,
        limit: 0,
        depth: 1,
        pagination: false,
      }),
    ])

  const when = (doc: { updatedAt?: string | null }) =>
    doc.updatedAt ? new Date(doc.updatedAt) : undefined

  // Каталог меняется вместе с любым сервисом — берём самую свежую правку
  const catalogTouched = services.docs
    .map(when)
    .filter((d): d is Date => d !== undefined)
    .sort((a, b) => b.getTime() - a.getTime())[0]

  const staticPages: Entry[] = [
    { url: url('/'), lastModified: when(home) },
    { url: url('/services'), lastModified: catalogTouched },
    { url: url('/services/popular'), lastModified: catalogTouched },
    { url: url('/fresh'), lastModified: when(fresh) },
    { url: url('/grm'), lastModified: when(grm) },
    { url: url('/its'), lastModified: when(its) },
    { url: url('/about'), lastModified: when(about) },
    { url: url('/contacts'), lastModified: when(contacts) },
  ]

  const programPages: Entry[] = programs.docs.map((p) => ({
    url: url(`/programs/${p.slug}`),
    lastModified: when(p),
  }))

  const categoryPages: Entry[] = categories.docs.map((c) => ({
    url: url(`/services/${c.slug}`),
    lastModified: when(c),
  }))

  const servicePages: Entry[] = services.docs.flatMap((s) => {
    // Без категории у сервиса нет адреса: страница живёт под /services/[category]/
    if (typeof s.category !== 'object' || s.category === null) return []
    return [
      {
        url: url(`/services/${s.category.slug}/${s.slug}`),
        lastModified: when(s),
      },
    ]
  })

  return [...staticPages, ...programPages, ...categoryPages, ...servicePages]
}
