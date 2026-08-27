import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { VISIBLE } from '@/lib/queries'
import { ServiceDetail } from '@/components/catalog/ServiceDetail'

async function getService(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'services',
    where: { and: [VISIBLE, { slug: { equals: slug } }] },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'services',
    where: VISIBLE,
    limit: 100,
    depth: 1,
    pagination: false,
  })

  return docs
    .filter((s) => typeof s.category === 'object' && s.category !== null)
    .map((s) => ({
      category: (s.category as { slug: string }).slug,
      slug: s.slug,
    }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return {}

  return {
    title: `${service.title} — сервис 1С | ПРО-М`,
    description: service.description,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const service = await getService(slug)

  if (!service) notFound()

  const actual =
    typeof service.category === 'object' && service.category !== null
      ? service.category.slug
      : null

  if (actual !== category) notFound()

  return <ServiceDetail service={service} />
}