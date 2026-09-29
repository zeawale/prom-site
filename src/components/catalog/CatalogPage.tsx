import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { VISIBLE } from '@/lib/queries'
import { Sidebar } from './Sidebar'
import { CatalogResults } from './CatalogResults'
import styles from './CatalogPage.module.css'

type Props = {
  categorySlug?: string
  flag?: 'popular' | 'new'
}

/**
 * Страница каталога. Серверная и статическая: категорию и флаг задаёт
 * роут, а поисковая строка ?q= сюда не доходит — её читает и применяет
 * CatalogResults в браузере. Пока страница получала searchParams, Next
 * считал её динамической и рендерил каталог на каждый запрос.
 */
export async function CatalogPage({ categorySlug, flag }: Props) {
  const payload = await getPayload({ config })

  const filters: Where[] = [VISIBLE]
  if (categorySlug) filters.push({ 'category.slug': { equals: categorySlug } })
  if (flag === 'popular') filters.push({ isPopular: { equals: true } })
  if (flag === 'new') filters.push({ isNew: { equals: true } })

  const { docs: services } = await payload.find({
    collection: 'services',
    where: { and: filters },
    limit: 100,
    depth: 1,
    sort: 'title',
  })

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.heading}>1С сервисы</h1>
        <p className={styles.lead}>
          Сервисы «1С:ИТС» подключаются к вашей программе 1С и закрывают отдельные задачи:
          отчётность, обмен документами, маркировку, кадры, приём оплат. Выберите категорию или
          найдите сервис по названию.
        </p>
      </header>

      <div className={styles.layout}>
        <div>
          <Sidebar activeSlug={categorySlug ?? flag} />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner}>
            <CatalogResults services={services} />
          </div>
        </div>
      </div>
    </main>
  )
}
