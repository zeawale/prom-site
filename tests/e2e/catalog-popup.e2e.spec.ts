import { test, expect, type Page } from '@playwright/test'
import { getConsentVersion, presetCookieConsent } from '../helpers/cookieConsent'

/**
 * Каталог сервисов: попап карточки и поиск.
 *
 * Попап подменяет адрес на /services/<категория>/<слаг> в обход роутера
 * Next, чтобы ссылку на сервис можно было скопировать, а «назад» закрывало
 * окно. Поиск живёт целиком в браузере: страница статическая, ?q=
 * читается после гидратации и пишется в адрес с задержкой.
 */

const BASE = 'http://localhost:3000'

type ServiceDoc = {
  title: string
  slug: string
  category: { slug: string }
  related?: { title: string; category: { slug: string } }[]
}

/** Первая карточка каталога — по данным API, а не по индексу в DOM */
async function firstService(page: Page): Promise<ServiceDoc> {
  const res = await page.request.get(
    `${BASE}/api/services?where[isHidden][not_equals]=true&sort=title&limit=1&depth=2`,
  )
  const data = (await res.json()) as { docs: ServiceDoc[] }
  return data.docs[0]
}

function cards(page: Page) {
  return page.getByRole('region', { name: 'Каталог сервисов' }).getByRole('button')
}

/** Карточка конкретного сервиса — по точному заголовку, а не подстроке:
 *  «1С-Отчётность» иначе совпала бы и с «1С-Отчётность для ИП» */
function card(page: Page, title: string) {
  return cards(page).filter({ has: page.getByRole('heading', { name: title, exact: true }) })
}

test.describe('Попап каталога', () => {
  test.beforeEach(async ({ page, request }) => {
    await presetCookieConsent(page, await getConsentVersion(request))
  })

  test('открывается с карточки, меняет адрес, закрывается крестиком', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services`)

    await card(page, service.title).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { level: 1 })).toHaveText(service.title)
    await expect(page).toHaveURL(`${BASE}/services/${service.category.slug}/${service.slug}`)
    // Страница под попапом не прокручивается
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden')

    await dialog.getByRole('button', { name: 'Закрыть' }).click()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(`${BASE}/services`)
    await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  })

  test('Escape и «назад» в браузере закрывают попап', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services`)

    await card(page, service.title).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(`${BASE}/services`)

    await card(page, service.title).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.goBack()
    await expect(page.getByRole('dialog')).toBeHidden()
    await expect(page).toHaveURL(`${BASE}/services`)
  })

  test('адрес сервиса открывается и отдельной страницей', async ({ page }) => {
    const service = await firstService(page)
    const res = await page.goto(`${BASE}/services/${service.category.slug}/${service.slug}`)
    expect(res?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(service.title)
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('кнопка заявки в попапе открывает форму поверх него', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services`)
    await card(page, service.title).click()

    const popup = page.getByRole('dialog').first()
    await popup.getByRole('button', { name: /подключить|заявк/i }).click()

    // Два диалога: попап сервиса и форма заявки поверх
    await expect(page.getByRole('dialog')).toHaveCount(2)
    await expect(page.getByRole('heading', { name: /помощь с выбором/i })).toBeVisible()
    // Скрытое поле источника несёт слаг сервиса — по нему в админке видно,
    // откуда пришла заявка
    await expect(page.locator('input[name="page"]')).toHaveValue(`service:${service.slug}`)
  })

  test('связанный сервис открывается следующим попапом', async ({ page }) => {
    const res = await page.request.get(
      `${BASE}/api/services?where[related][exists]=true&limit=50&depth=2`,
    )
    const { docs } = (await res.json()) as { docs: ServiceDoc[] }
    const withRelated = docs.find((d) => (d.related ?? []).length > 0)
    test.skip(!withRelated, 'В каталоге нет сервисов со связанными')
    const service = withRelated!
    const related = service.related![0]

    await page.goto(`${BASE}/services/${service.category.slug}`)
    await card(page, service.title).click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByRole('heading', { level: 1 })).toHaveText(service.title)

    await dialog.getByRole('button', { name: related.title }).click()
    await expect(dialog.getByRole('heading', { level: 1 })).toHaveText(related.title)
    await expect(page).toHaveURL(new RegExp(`/services/${related.category.slug}/`))

    // Один «назад» закрывает окно и возвращает адрес категории
    await page.goBack()
    await expect(dialog).toBeHidden()
    await expect(page).toHaveURL(`${BASE}/services/${service.category.slug}`)
  })
})

test.describe('Поиск по каталогу', () => {
  test.beforeEach(async ({ page, request }) => {
    await presetCookieConsent(page, await getConsentVersion(request))
  })

  test('фильтрует карточки и пишет ?q= в адрес без перезагрузки', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services`)
    const total = await cards(page).count()
    expect(total).toBeGreaterThan(1)

    const requests: string[] = []
    page.on('request', (r) => {
      if (r.url().startsWith(BASE)) requests.push(r.url())
    })

    const input = page.getByRole('searchbox', { name: /поиск/i })
    await input.fill(service.title)

    await expect(card(page, service.title)).toHaveCount(1)
    expect(await cards(page).count()).toBeLessThan(total)
    await expect.poll(() => new URL(page.url()).searchParams.get('q')).toBe(service.title)

    // Адрес с ?q= у сервера не запрашивался: фильтр и адрес — целиком в
    // браузере. Префетч ссылок сайдбара сюда не попадает: в нём нет q
    expect(requests.filter((u) => u.includes('q='))).toHaveLength(0)

    await input.fill('')
    await expect(cards(page)).toHaveCount(total)
    await expect(page).toHaveURL(`${BASE}/services`)
  })

  test('адрес с ?q= открывается уже отфильтрованным', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services?q=${encodeURIComponent(service.title)}`)

    await expect(page.getByRole('searchbox', { name: /поиск/i })).toHaveValue(service.title)
    await expect(card(page, service.title)).toHaveCount(1)
    // В самом HTML при этом полный список — поисковикам и без JavaScript
    const html = await (await page.request.get(`${BASE}/services?q=zzz`)).text()
    expect(html).toContain(service.title)
  })

  test('пустой результат показывает подсказку', async ({ page }) => {
    await page.goto(`${BASE}/services`)
    await page.getByRole('searchbox', { name: /поиск/i }).fill('такого сервиса нет')
    await expect(page.getByText(/ничего не нашлось/i)).toBeVisible()
    await expect(page.getByRole('region', { name: 'Каталог сервисов' })).toHaveCount(0)
  })

  test('переход в категорию сбрасывает поиск', async ({ page }) => {
    const service = await firstService(page)
    await page.goto(`${BASE}/services?q=${encodeURIComponent(service.title)}`)
    await expect(page.getByRole('searchbox', { name: /поиск/i })).toHaveValue(service.title)

    await page
      .getByRole('navigation', { name: 'Категории сервисов' })
      .first()
      .getByRole('link')
      .nth(1)
      .click()
    await expect(page).not.toHaveURL(/q=/)
    await expect(page.getByRole('searchbox', { name: /поиск/i })).toHaveValue('')
  })
})
