import { test, expect, type Page } from '@playwright/test'

/**
 * Блоки «Вопросы и ответы»: главная, три продуктовые страницы и программы.
 *
 * Тексты вопросов здесь не зашиты — их правят в админке. Проверяется то,
 * что ломается кодом: блок на месте и подписан, аккордеон держит открытым
 * ровно один вопрос, а разметка FAQPage совпадает с тем, что видно на
 * странице, — поисковики за расхождение снимают разметку.
 */

const BASE = 'http://localhost:3000'

const PAGES = [
  '/',
  '/fresh',
  '/its',
  '/grm',
  '/programs/buhgalteriya',
  '/programs/erp',
  '/programs/kompleksnaya-avtomatizatsiya',
  '/programs/roznitsa',
  '/programs/upravlenie-torgovley',
  '/programs/zup',
  '/programs/litsenzii',
]

type FaqLd = { '@type': string; mainEntity: { name: string }[] }

async function faqJsonLd(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.map((text) => JSON.parse(text) as FaqLd).filter((d) => d['@type'] === 'FAQPage')
}

for (const path of PAGES) {
  test(`${path}: блок вопросов и разметка FAQPage`, async ({ page }) => {
    await page.goto(`${BASE}${path}`)

    // Секция подписана своим заголовком: по aria-labelledby, а не по тексту
    const faq = page.locator('section:has(h2[id$="-faq"])')
    await expect(faq).toHaveCount(1)
    const titleId = await faq.locator('h2').getAttribute('id')
    await expect(faq).toHaveAttribute('aria-labelledby', titleId!)

    const buttons = faq.locator('h3 button')
    const count = await buttons.count()
    expect(count, 'вопросов в блоке').toBeGreaterThan(0)

    // Изначально открыт первый, клик по второму закрывает первый
    await expect(buttons.first()).toHaveAttribute('aria-expanded', 'true')
    if (count > 1) {
      await buttons.nth(1).click()
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true')
      await expect(buttons.first()).toHaveAttribute('aria-expanded', 'false')
    }

    const ld = await faqJsonLd(page)
    expect(ld, 'одна разметка FAQPage').toHaveLength(1)
    const visible = (await faq.locator('h3 button > span:first-child').allTextContents()).map((s) =>
      s.trim(),
    )
    expect(ld[0].mainEntity.map((q) => q.name)).toEqual(visible)
  })
}
