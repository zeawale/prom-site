'use client'

import { useEffect, useState } from 'react'
import type { Service } from '@/payload-types'
import { matchesQuery, setCatalogQuery, useCatalogQuery } from '@/lib/catalogQuery'
import { ServiceCard } from './ServiceCard'
import { SearchInput } from './SearchInput'
import styles from './CatalogPage.module.css'

type Props = {
  services: Service[]
}

/**
 * Поиск и сетка карточек каталога. Компонент клиентский, чтобы страница
 * осталась статической: раньше ?q= читала сама страница через
 * searchParams, и Next рендерил весь каталог на каждый запрос.
 *
 * Список сервисов приходит с сервера целиком и уже отфильтрован по
 * категории или флагу; здесь к нему применяется только поисковая строка.
 * На сервере запрос всегда пустой — так полный список попадает в HTML,
 * а фильтр из адреса накладывается после гидратации (см. lib/catalogQuery).
 *
 * Два источника значения. Адрес (useCatalogQuery) — истина по умолчанию:
 * с него стартуем, к нему возвращаемся по «назад». Набранное в поле
 * (typed) — временное: фильтр применяется на каждый символ, а в адрес
 * строка уходит с задержкой 300 мс, иначе Safari упирается в лимит
 * replaceState. Как только адрес обновился, typed сбрасывается и значение
 * снова читается из адреса — это штатный приём React «сброс состояния при
 * смене входных данных», без эффекта.
 */
export function CatalogResults({ services }: Props) {
  const fromUrl = useCatalogQuery()
  const [typed, setTyped] = useState<string | null>(null)
  const [prevFromUrl, setPrevFromUrl] = useState(fromUrl)

  if (fromUrl !== prevFromUrl) {
    setPrevFromUrl(fromUrl)
    setTyped(null)
  }

  const query = typed ?? fromUrl

  useEffect(() => {
    if (typed === null) return
    const timer = setTimeout(() => setCatalogQuery(typed), 300)
    return () => clearTimeout(timer)
  }, [typed])

  const visible = services.filter((s) => matchesQuery(s, query))

  return (
    <>
      <div>
        <SearchInput value={query} onChange={setTyped} />
      </div>

      {visible.length > 0 ? (
        <div className={styles.gridWrap}>
          <div className={styles.grid} tabIndex={0} role="region" aria-label="Каталог сервисов">
            {visible.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.empty}>
          По запросу ничего не нашлось. Попробуйте другое слово или откройте полный каталог.
        </p>
      )}
    </>
  )
}
