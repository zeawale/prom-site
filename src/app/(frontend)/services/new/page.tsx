import type { Metadata } from 'next'
import { CatalogPage } from '@/components/catalog/CatalogPage'

export const metadata: Metadata = {
  title: 'Новые сервисы 1С',
  description: 'Сервисы 1С, появившиеся в каталоге недавно.',
  /* Пока флаг isNew не расставлен, страница показывает пустой каталог:
     в индекс такую пускать незачем. Снять, когда набор «Новинок» утвердят */
  robots: { index: false, follow: true },
}

export default async function NewPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  return <CatalogPage flag="new" query={q} />
}
