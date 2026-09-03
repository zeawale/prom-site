import { CatalogPage } from '@/components/catalog/CatalogPage'

export default async function NewPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <CatalogPage flag="new" query={q} />
}
