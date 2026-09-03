import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CatalogPage } from '@/components/catalog/CatalogPage'

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

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: category } },
    limit: 1,
  })

  if (!docs.length) notFound()

  return <CatalogPage categorySlug={category} query={q} />
}
