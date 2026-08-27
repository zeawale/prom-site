import { CatalogPage } from '@/components/catalog/CatalogPage'

export default async function PopularPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <CatalogPage flag="popular" query={q}/>
}