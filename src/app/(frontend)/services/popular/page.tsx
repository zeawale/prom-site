import type { Metadata } from 'next'
import { CatalogPage } from '@/components/catalog/CatalogPage'

export const metadata: Metadata = {
  title: 'Популярные сервисы 1С',
  description:
    'Сервисы 1С, которые подключают чаще всего: 1С-Отчётность, 1С-ЭДО, 1С:Контрагент, 1С:Кабинет сотрудника и другие.',
}

export default async function PopularPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <CatalogPage flag="popular" query={q} />
}
