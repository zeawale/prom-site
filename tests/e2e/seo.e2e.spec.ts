import { test, expect } from '@playwright/test'
import { LEGACY_REDIRECTS, LEGACY_GONE_PREFIXES } from '../../src/lib/legacy'

/**
 * Переезд и служебные адреса: редиректы со старого сайта, 410, 404,
 * sitemap и robots.
 *
 * Проверяются коды и заголовок Location, а не содержимое страниц: сломаться
 * здесь может таблица в lib/legacy.ts (опечатка в слаге, преемник, которого
 * больше нет) и proxy (лишний переход, слэш, потерянный query). Всё это
 * видно по ответу без рендера.
 *
 * Хост в тестах — localhost, поэтому сведение к www здесь не проверить:
 * proxy трогает домен только у боевого. Это проверяется руками после
 * деплоя: curl -I http://pm52.ru/kontakty/ должен дать один 301 сразу на
 * https://www.pm52.ru/contacts.
 */

const BASE = 'http://localhost:3000'

/** Location бывает и относительным, и абсолютным — сравниваем как URL */
const location = (headers: Record<string, string>) => new URL(headers['location'], BASE).href

test.describe('Редиректы со старого сайта', () => {
  for (const [from, to] of Object.entries(LEGACY_REDIRECTS)) {
    test(`${from}/ → ${to}`, async ({ request }) => {
      // Старые адреса WordPress всегда со слэшем в конце — так и просим
      const res = await request.get(`${BASE}${from}/`, { maxRedirects: 0 })
      expect(res.status(), 'код ответа').toBe(301)
      expect(location(res.headers()), 'Location').toBe(`${BASE}${to}`)
    })
  }

  test('преемники существуют', async ({ request }) => {
    // Редирект на 404 хуже отсутствия редиректа: поисковик видит цепочку в никуда
    const dead: string[] = []
    for (const to of new Set(Object.values(LEGACY_REDIRECTS))) {
      const res = await request.get(`${BASE}${to}`, { maxRedirects: 0 })
      if (res.status() !== 200) dead.push(`${to} → ${res.status()}`)
    }
    expect(dead, 'преемники не отвечают 200').toEqual([])
  })

  test('один переход: слэш, регистр и query снимаются вместе с редиректом', async ({ request }) => {
    const res = await request.get(`${BASE}/Kontakty/?utm_source=test`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(location(res.headers())).toBe(`${BASE}/contacts?utm_source=test`)
  })

  test('слэш в конце снимается и у новых адресов', async ({ request }) => {
    const res = await request.get(`${BASE}/about/`, { maxRedirects: 0 })
    expect(res.status()).toBe(301)
    expect(location(res.headers())).toBe(`${BASE}/about`)
  })
})

test.describe('Удалённые разделы', () => {
  for (const prefix of LEGACY_GONE_PREFIXES) {
    test(`${prefix}/ → 410`, async ({ request }) => {
      const res = await request.get(`${BASE}${prefix}/`, { maxRedirects: 0 })
      expect(res.status()).toBe(410)
    })
  }

  test('вложенный адрес раздела тоже 410', async ({ request }) => {
    const res = await request.get(`${BASE}/uslugi/abonentskoe-obsluzhivanie/stoimost/`, {
      maxRedirects: 0,
    })
    expect(res.status()).toBe(410)
    expect(await res.text()).toContain('Этой страницы больше нет')
  })
})

test.describe('404', () => {
  test('незнакомый адрес — 404 с нашей страницей', async ({ page }) => {
    const res = await page.goto(`${BASE}/takoy-stranicy-net`)
    expect(res?.status()).toBe(404)
    // Шапка на месте — значит, отрисована наша страница, а не заглушка Next
    await expect(page.getByRole('navigation', { name: 'Основное меню' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Страница не найдена')
  })

  test('несуществующая программа — та же 404', async ({ page }) => {
    const res = await page.goto(`${BASE}/programs/takoy-net`)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Страница не найдена')
  })
})

test.describe('sitemap и robots', () => {
  test('sitemap.xml: только индексируемые адреса', async ({ request }) => {
    const res = await request.get(`${BASE}/sitemap.xml`)
    expect(res.status()).toBe(200)
    const xml = await res.text()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)

    for (const must of ['/', '/services', '/fresh', '/grm', '/its', '/about', '/contacts']) {
      expect(locs, `нет ${must}`).toContain(must)
    }
    expect(
      locs.some((p) => p.startsWith('/programs/')),
      'нет программ',
    ).toBe(true)
    expect(
      locs.filter((p) => /^\/services\/[^/]+\/[^/]+$/.test(p)).length,
      'нет сервисов',
    ).toBeGreaterThan(10)

    // noindex-страницам и редиректу в карте не место
    for (const never of ['/privacy', '/cookie', '/consent', '/services/new', '/programs']) {
      expect(locs, `лишний ${never}`).not.toContain(never)
    }
    // Битые адреса в карте — это отчёт об ошибках в Вебмастере
    expect(
      locs.some((p) => p.endsWith('/') && p !== '/'),
      'слэш в конце',
    ).toBe(false)
  })

  test('robots.txt закрывает админку и ссылается на карту', async ({ request }) => {
    const res = await request.get(`${BASE}/robots.txt`)
    expect(res.status()).toBe(200)
    const text = await res.text()
    expect(text).toContain('Disallow: /admin')
    expect(text).toContain('Disallow: /api/')
    expect(text).toContain('Allow: /api/media/')
    expect(text).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/)
  })
})
