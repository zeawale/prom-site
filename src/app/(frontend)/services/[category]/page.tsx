import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CatalogPage } from '@/components/catalog/CatalogPage'

/** Категорию ищем по слагу и в метаданных, и в самой странице — вынесено,
 *  чтобы запрос был написан один раз, а не двумя разошедшимися копиями */
const findCategory = async (slug: string) => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category } = await params
  const doc = await findCategory(category)
  // Пустой объект — не забывчивость: заголовок подставит корневой layout,
  // а страницы всё равно не будет, её уронит notFound ниже
  if (!doc) return {}

  return {
    title: `${doc.title} — сервисы 1С`,
    description: `Сервисы 1С из категории «${doc.title}»: что входит, кому подходит и как подключить в Нижнем Новгороде.`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'categories',
    limit: 100,
    pagination: false,
  })
  return docs.map((c) => ({ category: c.slug }))
}

export default async function ServicesCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { category } = await params
  const { q } = await searchParams

  if (!(await findCategory(category))) notFound()

  return <CatalogPage categorySlug={category} query={q} />
}
