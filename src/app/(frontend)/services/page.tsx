import { CatalogPage } from '@/components/catalog/CatalogPage'

export default async function ServicesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <CatalogPage query={q} />
}
