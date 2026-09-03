import { getPayload } from 'payload'
import config from '@payload-config'
import type { Where } from 'payload'
import { VISIBLE } from '@/lib/queries'
import { ServiceCard } from './ServiceCard'
import { Sidebar } from './Sidebar'
import { SearchInput } from './SearchInput'
import styles from './CatalogPage.module.css'
import { Suspense } from 'react'
import { ServiceModalProvider } from './ServiceModalProvider'

type Props = {
  categorySlug?: string
  flag?: 'popular' | 'new'
  query?: string
}

export async function CatalogPage({ categorySlug, flag, query }: Props) {
  const payload = await getPayload({ config })

  const filters: Where[] = [VISIBLE]
  if (categorySlug) filters.push({ 'category.slug': { equals: categorySlug } })
  if (flag === 'popular') filters.push({ isPopular: { equals: true } })
  if (flag === 'new') filters.push({ isNew: { equals: true } })

  const { docs } = await payload.find({
    collection: 'services',
    where: { and: filters },
    limit: 100,
    depth: 1,
    sort: 'title',
  })

  const q = query?.trim().toLowerCase()
  const services = q
    ? docs.filter((s) => [s.title, s.headline, s.description].join(' ').toLowerCase().includes(q))
    : docs

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
        <div className={styles.aside}>
          <Sidebar activeSlug={categorySlug ?? flag} />
        </div>

        <div className={styles.content}>
          <div className={styles.contentInner}>
            <div className={styles.toolbar}>
              <Suspense fallback={null}>
                <SearchInput />
              </Suspense>
            </div>

            {services.length > 0 ? (
              <div className={styles.gridWrap}>
                <div
                  className={styles.grid}
                  tabIndex={0}
                  role="region"
                  aria-label="Каталог сервисов"
                >
                  {services.map((s) => (
                    <ServiceCard key={s.id} service={s} />
                  ))}
                </div>
              </div>
            ) : (
              <p className={styles.empty}>
                По запросу ничего не нашлось. Попробуйте другое слово или откройте полный каталог.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
