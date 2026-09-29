import type { Metadata } from 'next'
import { CatalogPage } from '@/components/catalog/CatalogPage'

export const metadata: Metadata = {
  title: 'Сервисы 1С',
  description:
    'Каталог сервисов 1С:ИТС: отчётность, ЭДО, маркировка, кадры, проверка контрагентов, приём оплат. Подключение и поддержка в Нижнем Новгороде.',
}

// searchParams здесь не читаются намеренно: ?q= обрабатывает CatalogResults
// в браузере, а страница остаётся статической
export default function ServicesIndexPage() {
  return <CatalogPage />
}
