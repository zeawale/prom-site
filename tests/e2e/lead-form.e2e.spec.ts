import { test, expect, type Page } from '@playwright/test'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { getConsentVersion, presetCookieConsent } from '../helpers/cookieConsent'

/**
 * Форма заявки — единственное место, где сайт что-то пишет, поэтому
 * проверяется не только экран, но и база: заявка должна лечь в Leads с
 * источником и реквизитами согласия. Всё, что тест создал, он же и
 * удаляет — по уникальному e-mail, чтобы не зацепить чужие записи.
 */

const BASE = 'http://localhost:3000'

/** Уникальный адрес на прогон: по нему находим и чистим свои заявки */
const stamp = Date.now()
const EMAIL = `e2e-lead-${stamp}@example.com`

async function findLeads() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'leads',
    where: { email: { equals: EMAIL } },
    // Хук ревалидации тут не стоит, но контекст на всякий случай тот же,
    // что у сидов — чтобы тест не тянул за собой пересборку страниц
    context: { disableRevalidate: true },
    overrideAccess: true,
  })
  return docs
}

async function cleanupLeads() {
  const payload = await getPayload({ config })
  await payload.delete({
    collection: 'leads',
    where: { email: { equals: EMAIL } },
    context: { disableRevalidate: true },
    overrideAccess: true,
  })
}

/** Открыть форму с главной: CTA хиро — первая кнопка заявки на странице */
async function openForm(page: Page) {
  await page.goto(`${BASE}/`)
  await page
    .getByRole('button', { name: /консультац|заявк/i })
    .first()
    .click()
  // Без имени: после отправки заголовок окна меняется на «Заявка
  // отправлена», и локатор по имени потерял бы окно
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('heading', { name: /помощь с выбором/i })).toBeVisible()
  return dialog
}

test.describe('Форма заявки', () => {
  test.beforeEach(async ({ page, request }) => {
    await presetCookieConsent(page, await getConsentVersion(request))
  })

  test.afterAll(async () => {
    await cleanupLeads()
  })

  test('кнопка отправки заблокирована без согласия', async ({ page }) => {
    const dialog = await openForm(page)
    const submit = dialog.getByRole('button', { name: 'Отправить заявку' })

    await expect(submit).toBeDisabled()
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await expect(submit).toBeEnabled()
  })

  test('неверные поля — ошибки у полей, заявка не создаётся', async ({ page }) => {
    const dialog = await openForm(page)

    await dialog.getByLabel('ФИО').fill('Я')
    await dialog.getByLabel('Телефон').fill('123')
    await dialog.getByLabel('E-mail').fill(EMAIL.replace('@', '-at-'))
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: 'Отправить заявку' }).click()

    await expect(dialog.getByText('Проверьте заполнение полей')).toBeVisible()
    await expect(dialog.getByText('Укажите имя')).toBeVisible()
    await expect(dialog.getByText(/Укажите телефон/)).toBeVisible()
    await expect(dialog.getByText('Проверьте адрес почты')).toBeVisible()
    // Форма не закрылась и осталась в состоянии ввода
    await expect(dialog.getByRole('button', { name: 'Отправить заявку' })).toBeEnabled()

    expect(await findLeads()).toHaveLength(0)
  })

  test('заявка уходит и ложится в Leads с источником и согласием', async ({ page }) => {
    const dialog = await openForm(page)

    await dialog.getByLabel('ФИО').fill('Тест Тестович')
    await dialog.getByLabel('Телефон').fill('+7 (999) 123-45-67')
    await dialog.getByLabel('E-mail').fill(EMAIL)
    await dialog.getByLabel('Комментарий').fill('Автотест формы заявки')
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: 'Отправить заявку' }).click()

    await expect(dialog.getByRole('heading', { name: 'Заявка отправлена' })).toBeVisible()
    // После отправки фокус уходит на «Закрыть»: с клавиатуры форму можно
    // закрыть, не выискивая кнопку
    await expect(dialog.getByRole('button', { name: 'Закрыть' })).toBeFocused()

    const leads = await findLeads()
    expect(leads).toHaveLength(1)
    const lead = leads[0]
    expect(lead.name).toBe('Тест Тестович')
    expect(lead.phone).toBe('+7 (999) 123-45-67')
    expect(lead.comment).toBe('Автотест формы заявки')
    expect(lead.status).toBe('new')
    // Источник — то, что RequestButton хиро передал в скрытое поле page
    expect(lead.page).toBeTruthy()
    expect(lead.consentAt).toBeTruthy()
    expect(lead.consentVersion).toBeTruthy()

    await dialog.getByRole('button', { name: 'Закрыть' }).click()
    await expect(dialog).toBeHidden()
  })

  test('с согласием на аналитику отправка достигает цели Метрики', async ({ page, request }) => {
    // Тег подменяется пустым скриптом, как в cookie-banner: вызовы
    // остаются в очереди window.ym.a, настоящих хитов нет
    await page.route(/mc\.yandex\.ru/, (route) =>
      route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }),
    )
    await presetCookieConsent(page, await getConsentVersion(request), {
      analytics: true,
      functional: false,
    })
    const dialog = await openForm(page)

    await dialog.getByLabel('ФИО').fill('Тест Метрики')
    await dialog.getByLabel('Телефон').fill('+7 (999) 123-45-67')
    await dialog.getByLabel('E-mail').fill(EMAIL)
    await dialog.getByLabel(/обработку персональных данных/i).check()
    await dialog.getByRole('button', { name: 'Отправить заявку' }).click()
    await expect(dialog.getByRole('heading', { name: 'Заявка отправлена' })).toBeVisible()

    const goals = await page.evaluate(() => {
      const ym = (window as unknown as { ym?: { a?: unknown[][] } }).ym
      return (ym?.a ?? []).map((args) => Array.from(args)).filter((c) => c[1] === 'reachGoal')
    })
    expect(goals.map((c) => c[2])).toEqual(['lead_sent'])
  })

  test('Escape и клик по фону закрывают форму', async ({ page }) => {
    let dialog = await openForm(page)
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()

    dialog = await openForm(page)
    // Клик по подложке за пределами окна формы
    await page.mouse.click(5, 5)
    await expect(dialog).toBeHidden()
  })

  test('фокус заперт внутри формы', async ({ page }) => {
    const dialog = await openForm(page)
    // Первое поле получает фокус при открытии
    await expect(dialog.getByLabel('ФИО')).toBeFocused()

    // Shift+Tab с первого фокусируемого элемента (кнопка «Закрыть» идёт
    // в разметке первой) уводит на последний — ссылку на согласие или
    // кнопку, но не наружу
    await dialog.getByRole('button', { name: 'Закрыть' }).focus()
    await page.keyboard.press('Shift+Tab')
    const active = await page.evaluate(
      () => document.activeElement?.closest('[role="dialog"]') !== null,
    )
    expect(active).toBe(true)
  })
})
