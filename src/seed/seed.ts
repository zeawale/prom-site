import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Category } from '../payload-types'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** Слаг иконки — union из 26 значений, генерируется Payload из select-поля */
type IconSlug = NonNullable<Category['icon']>

const CATEGORIES: { slug: string; title: string; icon: IconSlug }[] = [
  { slug: 'otchetnost-i-nalogi', title: 'Отчётность и налоги', icon: 'report' },
  { slug: 'edo', title: 'ЭДО', icon: 'signature' },
  { slug: 'proverka-kontragentov', title: 'Проверка контрагентов', icon: 'shield' },
  { slug: 'personal-i-kadry', title: 'Персонал и кадры', icon: 'users' },
  { slug: 'markirovka', title: 'Маркировка', icon: 'barcode' },
  { slug: 'finansy-i-platezhi', title: 'Финансы и платежи', icon: 'wallet' },
  { slug: 'internet-torgovlya', title: 'Интернет-торговля', icon: 'cart' },
  { slug: 'logistika-i-dostavka', title: 'Логистика и доставка', icon: 'truck' },
  { slug: 'avtomatizatsiya-ucheta', title: 'Автоматизация учёта', icon: 'gear' },
  {
    slug: 'infrastruktura-i-podderzhka',
    title: 'Инфраструктура и поддержка',
    icon: 'server',
  },
]

type RawService = {
  id: string
  category_ids: string[]
  is_popular: boolean
  is_new: boolean
  icon: IconSlug
  title: string
  headline: string
  description: string
  related_ids: string[]
  popup: {
    who_needs_it: string[]
    how_it_works: { step: number; title: string; description: string }[]
    requirements: string[]
    cta_text: string
  }
  source_urls: string[]
}

const seed = async () => {
  const payload = await getPayload({ config })
  const jsonPath = path.resolve(dirname, '1c_services_catalog.json')
  const raw: RawService[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

  // 1. Чистим — сначала сервисы (на них ссылаются), потом категории
  await payload.delete({ collection: 'services', where: { id: { exists: true } } })
  await payload.delete({ collection: 'categories', where: { id: { exists: true } } })
  console.log('Коллекции очищены')

  // 2. Категории
  const catIdBySlug = new Map<string, number>()
  for (const [i, c] of CATEGORIES.entries()) {
    const created = await payload.create({
      collection: 'categories',
      data: { ...c, order: i },
    })
    catIdBySlug.set(c.slug, created.id as number)
  }
  console.log(`Категорий создано: ${catIdBySlug.size}`)

  // 3. Сервисы без related
  const svcIdBySlug = new Map<string, number>()
  for (const s of raw) {
    const categoryId = catIdBySlug.get(s.category_ids[0])
    if (!categoryId) throw new Error(`Нет категории ${s.category_ids[0]} для ${s.id}`)

    const created = await payload.create({
      collection: 'services',
      data: {
        slug: s.id,
        title: s.title,
        headline: s.headline,
        description: s.description,
        category: categoryId,
        icon: s.icon,
        isPopular: s.is_popular,
        isNew: s.is_new,
        popup: {
          whoNeedsIt: s.popup.who_needs_it.map((text) => ({ text })),
          howItWorks: s.popup.how_it_works.map(({ title, description }) => ({
            title,
            description,
          })),
          requirements: s.popup.requirements.map((text) => ({ text })),
          ctaText: s.popup.cta_text,
        },
        sourceUrls: s.source_urls.map((url) => ({ url })),
      },
    })
    svcIdBySlug.set(s.id, created.id as number)
  }
  console.log(`Сервисов создано: ${svcIdBySlug.size}`)

  // 4. Второй проход — связи
  let linked = 0
  for (const s of raw) {
    if (!s.related_ids.length) continue

    const related = s.related_ids.map((r) => {
      const id = svcIdBySlug.get(r)
      if (!id) throw new Error(`Битая ссылка ${r} в ${s.id}`)
      return id
    })

    const selfId = svcIdBySlug.get(s.id)
    if (!selfId) throw new Error(`Не найден сервис ${s.id}`)

    await payload.update({
      collection: 'services',
      id: selfId,
      data: { related },
    })
    linked++
  }
  console.log(`Связей проставлено: ${linked}`)

  // 5. Реквизиты
  await payload.updateGlobal({
    slug: 'settings',
    data: {
      phone: '+7 (831) 282-31-99',
      email: 'info@pm52.ru',
      address: 'Нижний Новгород, Казанское шоссе, д.12 к.1 оф.311',
      workHours: 'Пн–Пт 09:00–18:00',
      legalName: 'ООО «НПП ПРО-М»',
      inn: '5260165194',
    },
  })
  console.log('Реквизиты записаны')

  console.log('Готово')
  process.exit(0)
}

process.on('unhandledRejection', (e) => {
  console.error('UNHANDLED REJECTION:', e)
  process.exit(1)
})

seed().catch((e) => {
  console.error('ОШИБКА В SEED:', e)
  process.exit(1)
})