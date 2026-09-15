import type { Metadata } from 'next'
import { CatalogPage } from '@/components/catalog/CatalogPage'

export const metadata: Metadata = {
  title: 'Сервисы 1С',
  description:
    'Каталог сервисов 1С:ИТС: отчётность, ЭДО, маркировка, кадры, проверка контрагентов, приём оплат. Подключение и поддержка в Нижнем Новгороде.',
}

export default async function ServicesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  return <CatalogPage query={q} />
}
