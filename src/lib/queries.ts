import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import type { Service } from '@/payload-types'
import type { Program } from '@/payload-types'

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
    count: countBy((s) => typeof s.category === 'object' && s.category?.slug === c.slug),
    href: `/services/${c.slug}`,
  }))

  return { flags, categories, total: list.length }
}

export const getPrograms = async (): Promise<Program[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'programs',
    sort: 'order',
    limit: 100,
    // depth 0: связей у коллекции нет, глубже ходить незачем
    depth: 0,
  })
  return docs
}

/** Одна программа по слагу. undefined, если такой нет */
export const getProgram = async (slug: string): Promise<Program | undefined> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'programs',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0]
}

/** Общая шапка раздела и дисклеймер */
export const getProgramsSection = async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'programs-section', depth: 0 })
}

/** Страница /its целиком */
export const getITS = async () => {
  const payload = await getPayload({ config })
  // depth: 1, в отличие от соседей: строки таблицы ссылаются на карточки
  // каталога, и нужен документ, а не число
  return payload.findGlobal({ slug: 'its', depth: 2 })
}

/** Страница /fresh целиком */
export const getFresh = async () => {
  const payload = await getPayload({ config })
  // depth: 0 — связей внутри нет, в отличие от ITS с его ссылками на каталог
  return payload.findGlobal({ slug: 'fresh', depth: 0 })
}

/** Страница /grm целиком */
export const getGrm = async () => {
  const payload = await getPayload({ config })
  // depth: 0 — как у Fresh, связей внутри нет
  return payload.findGlobal({ slug: 'grm', depth: 0 })
}

/** Один юридический документ по слагу. undefined, если его нет в базе */
export const getLegalPage = async (slug: 'privacy' | 'cookie' | 'consent') => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'legal-pages',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  return docs[0]
}

/**
 * Версия согласия для записи в заявку.
 * Живёт в документе, а не в константе: текст согласия правится в админке,
 * и версия обязана меняться вместе с ним. Константа в lib/consent.ts
 * осталась запасным значением на случай, когда документа ещё нет.
 */
export const getConsentVersion = async (): Promise<string | undefined> => {
  const doc = await getLegalPage('consent')
  return doc?.version ?? undefined
}

/** Блок сравнения. Один и тот же на /fresh и на /grm */
export const getFreshVsGrm = async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'fresh-vs-grm', depth: 0 })
}

export const getAbout = async () => {
  const payload = await getPayload({ config })
  // depth: 1 — фото директора это upload-связь, без глубины вместо
  // документа приедет id. Отзывы страница берёт отдельным запросом
  return payload.findGlobal({ slug: 'about', depth: 1 })
}

/**
 * Страница /contacts.
 *
 * depth: 0 — связей внутри нет. Сами реквизиты живут в Settings, здесь
 * только заголовки карточек, подписи и настройки карты.
 */
export const getContacts = async () => {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'contacts', depth: 0 })
}

export const getHome = async () => {
  const payload = await getPayload({ config })
  // depth: 0 — связей внутри глобала нет: отзывы и карточки сервисов
  // страница берёт отдельными запросами
  return payload.findGlobal({ slug: 'home', depth: 0 })
}

/**
 * Отзывы для главной. Отдельный запрос, а не поле глобала: те же карточки
 * идут на «О компании», а дублировать цитату в двух местах — верный способ
 * получить две её версии.
 */
export const getHomeReviews = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    where: { showOnHome: { equals: true } },
    limit: 3,
    depth: 0,
    sort: 'order',
  })
  return docs
}

/**
 * Все отзывы для «О компании», в порядке поля order.
 *
 * Без фильтра showOnHome, в отличие от getHomeReviews: флаг решает, кто
 * попадает на главную, а на странице о компании выводятся все.
 */
export const getAllReviews = async () => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'reviews',
    limit: 0,
    pagination: false,
    depth: 0,
    sort: 'order',
  })
  return docs
}

/**
 * Популярные сервисы каталога — лента блока «Сервисы 1С» на главной.
 *
 * Лимит по умолчанию щедрый: блок прокручивается горизонтально и должен
 * показывать все сервисы с флагом «Популярное», а не первые три. Число
 * оставлено предохранителем на случай, если флаг когда-нибудь проставят
 * всему каталогу.
 *
 * depth: 1 обязателен: карточка открывает попап вызовом
 * open(categorySlug, slug), и без глубины category останется числом.
 * Тот же подводный камень, что у getITS.
 */
export const getPopularServices = async (limit = 24): Promise<Service[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'services',
    where: { and: [VISIBLE, { isPopular: { equals: true } }] },
    limit,
    depth: 1,
    sort: 'title',
  })
  return docs
}
