import { test, expect, type Page } from '@playwright/test'
import {
  CONSENT_STORAGE_KEY,
  getConsentVersion,
  presetCookieConsent,
} from '../helpers/cookieConsent'

/**
 * Cookie-баннер. Кроме «показался / спрятался» здесь проверяются три
 * вещи, ради которых баннер вообще написан так, а не иначе
 * (см. комментарий в CookieConsent.tsx):
 *   • отказ и согласие — кнопки одного размера, без подталкивания;
 *   • до ответа сторонних ресурсов на странице нет (карта на «Контактах»,
 *     Метрика);
 *   • новая версия условий спрашивает заново.
 *
 * Тег Метрики подменяется пустым скриптом во всех тестах файла: «Принять
 * все» иначе слало бы настоящие хиты. Пустой тег оставляет на месте
 * очередь вызовов `window.ym.a` — по ней и видно, что ушло бы в Метрику.
 */

const BASE = 'http://localhost:3000'
const METRIKA = /mc\.yandex\.ru/

test.beforeEach(async ({ page }) => {
  await page.route(METRIKA, (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
  )
})

/** Вызовы Метрики, накопленные в очереди до загрузки тега */
async function ymCalls(page: Page): Promise<unknown[][] | null> {
  return page.evaluate(() => {
    const ym = (window as unknown as { ym?: { a?: unknown[][] } }).ym
    return ym ? (ym.a ?? []).map((args) => Array.from(args)) : null
  })
}

const METRIKA_HINT =
  'Метрики нет на странице: dev-сервер запущен без NEXT_PUBLIC_YM_ID. ' +
  'Остановите pnpm dev — Playwright поднимет свой сервер со счётчиком-заглушкой'

function banner(page: Page) {
  return page.getByRole('region', { name: /cookie/i })
}

async function stored(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), CONSENT_STORAGE_KEY)
}

test.describe('Cookie-баннер', () => {
  test('первый визит: баннер виден, кнопки отказа и согласия равны', async ({ page }) => {
    await page.goto(`${BASE}/`)
    const region = banner(page)
    await expect(region).toBeVisible()

    const accept = region.getByRole('button').nth(0)
    const reject = region.getByRole('button').nth(1)
    await expect(accept).toBeVisible()
    await expect(reject).toBeVisible()

    const a = await accept.boundingBox()
    const r = await reject.boundingBox()
    expect(a && r && Math.abs(a.height - r.height) <= 1).toBe(true)

    const weights = await Promise.all(
      [accept, reject].map((b) => b.evaluate((el) => getComputedStyle(el).fontWeight)),
    )
    expect(weights[0]).toBe(weights[1])

    // Ничего ещё не записано
    expect(await stored(page)).toBeNull()
  })

  test('«принять всё» прячет баннер насовсем — и после перезагрузки', async ({ page, request }) => {
    const version = await getConsentVersion(request)
    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button').nth(0).click()
    await expect(banner(page)).toBeHidden()

    expect(JSON.parse((await stored(page)) ?? 'null')).toEqual({
      version,
      analytics: true,
      functional: true,
    })

    await page.reload()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(banner(page)).toBeHidden()
  })

  test('«только необходимые» прячет баннер, категории выключены', async ({ page, request }) => {
    const version = await getConsentVersion(request)
    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button').nth(1).click()
    await expect(banner(page)).toBeHidden()

    expect(JSON.parse((await stored(page)) ?? 'null')).toEqual({
      version,
      analytics: false,
      functional: false,
    })
  })

  test('настройки: включить только аналитику', async ({ page, request }) => {
    const version = await getConsentVersion(request)
    await page.goto(`${BASE}/`)
    await banner(page).getByRole('button').nth(2).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()

    const switches = dialog.getByRole('switch')
    // Необходимые — всегда включены и заблокированы
    await expect(switches.nth(0)).toHaveAttribute('aria-checked', 'true')
    await expect(switches.nth(0)).toHaveAttribute('aria-disabled', 'true')
    // Остальные выключены по умолчанию: согласие только явное
    await expect(switches.nth(1)).toHaveAttribute('aria-checked', 'false')
    await expect(switches.nth(2)).toHaveAttribute('aria-checked', 'false')

    await switches.nth(1).click()
    await expect(switches.nth(1)).toHaveAttribute('aria-checked', 'true')
    await dialog
      .getByRole('button')
      .filter({ hasText: /сохранить/i })
      .click()

    await expect(dialog).toBeHidden()
    await expect(banner(page)).toBeHidden()
    expect(JSON.parse((await stored(page)) ?? 'null')).toEqual({
      version,
      analytics: true,
      functional: false,
    })
  })

  test('карта на «Контактах» грузится только после согласия', async ({ page }) => {
    await page.goto(`${BASE}/contacts`)
    await expect(banner(page)).toBeVisible()
    // До ответа iframe карты нет в DOM вовсе, а не спрятан
    await expect(page.locator('iframe')).toHaveCount(0)

    await banner(page).getByRole('button').nth(1).click()
    await expect(banner(page)).toBeHidden()
    // Отказ — карты по-прежнему нет
    await expect(page.locator('iframe')).toHaveCount(0)

    // Разовое «показать карту» работает поверх отказа
    await page.getByRole('button', { name: /карт/i }).click()
    await expect(page.locator('iframe')).toHaveCount(1)
  })

  test('согласие на функциональные — карта есть сразу', async ({ page, request }) => {
    await presetCookieConsent(page, await getConsentVersion(request), {
      analytics: false,
      functional: true,
    })
    await page.goto(`${BASE}/contacts`)
    await expect(banner(page)).toBeHidden()
    await expect(page.locator('iframe')).toHaveCount(1)
  })

  test('старая версия условий — спрашивает заново', async ({ page }) => {
    await presetCookieConsent(page, '1970-01-01', { analytics: true, functional: true })
    await page.goto(`${BASE}/`)
    await expect(banner(page)).toBeVisible()
  })

  test('баннер не попадает в статический HTML', async ({ request }) => {
    // Страницы собраны заранее, согласия там быть не может — иначе баннер
    // мигал бы у всех, кто уже ответил
    // Тексты баннера в HTML есть — в полезной нагрузке React для
    // гидратации (<script>), это нормально. Не должно быть самой разметки
    const html = await (await request.get(`${BASE}/`)).text()
    const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    expect(markup).not.toMatch(/role="region"[^>]*aria-label="Мы используем cookie"/)
    expect(markup).not.toContain('Только необходимые')
  })
})

test.describe('Метрика под согласие', () => {
  test('до ответа и после отказа к Метрике не уходит ни одного запроса', async ({ page }) => {
    const requests: string[] = []
    page.on('request', (r) => {
      if (METRIKA.test(r.url())) requests.push(r.url())
    })

    await page.goto(`${BASE}/`)
    await expect(banner(page)).toBeVisible()
    expect(await ymCalls(page)).toBeNull()

    await banner(page).getByRole('button', { name: 'Только необходимые' }).click()
    await expect(banner(page)).toBeHidden()
    expect(await ymCalls(page)).toBeNull()
    expect(requests).toEqual([])
  })

  test('«принять все» включает Метрику без перезагрузки', async ({ page }) => {
    await page.goto(`${BASE}/`)
    const tag = page.waitForRequest(/mc\.yandex\.ru\/metrika\/tag\.js/)
    await banner(page).getByRole('button', { name: 'Принять все' }).first().click()
    await tag

    const calls = (await ymCalls(page)) ?? []
    expect(calls.map((c) => c[1]), METRIKA_HINT).toEqual(['init', 'hit'])
    // Только статистика посещений: политика cookie не обещает записи действий
    expect(calls[0][2]).toMatchObject({ defer: true, webvisor: false, clickmap: false })
  })

  test('переход по сайту без перезагрузки — ещё один хит с прошлой страницей в referer', async ({
    page,
    request,
  }) => {
    await presetCookieConsent(page, await getConsentVersion(request), {
      analytics: true,
      functional: false,
    })
    await page.goto(`${BASE}/`)
    await expect.poll(async () => (await ymCalls(page))?.length ?? 0, { message: METRIKA_HINT }).toBe(2)

    await page.getByRole('navigation').getByRole('link', { name: 'О компании' }).first().click()
    await page.waitForURL(`${BASE}/about`)

    await expect.poll(async () => (await ymCalls(page))?.length ?? 0).toBe(3)
    const hit = (await ymCalls(page))![2]
    expect(hit[1]).toBe('hit')
    expect(hit[2]).toBe(`${BASE}/about`)
    expect(hit[3]).toMatchObject({ referer: `${BASE}/` })
  })

  test('согласие на старые условия Метрику не включает', async ({ page }) => {
    await presetCookieConsent(page, '1970-01-01', { analytics: true, functional: true })
    await page.goto(`${BASE}/`)
    await expect(banner(page)).toBeVisible()
    expect(await ymCalls(page)).toBeNull()
  })
})
