import type { APIRequestContext, Page } from '@playwright/test'

/** Ключ хранилища — тот же, что в src/lib/cookieConsent.ts */
export const CONSENT_STORAGE_KEY = 'prom.cookieConsent.v1'

/** Текущая версия условий — из CMS, а не константой: её правят в админке */
export async function getConsentVersion(request: APIRequestContext): Promise<string> {
  const res = await request.get('http://localhost:3000/api/globals/cookie-banner')
  const data = (await res.json()) as { version: string }
  return data.version
}

/**
 * Ответить на cookie-баннер заранее, до загрузки страницы.
 *
 * Тестам формы заявки и попапа каталога баннер только мешает: он лежит
 * поверх низа страницы и перехватывает клики. Здесь он считается уже
 * отвеченным — ровно так, как у посетителя, который зашёл второй раз.
 */
export async function presetCookieConsent(
  page: Page,
  version: string,
  choice: { analytics: boolean; functional: boolean } = { analytics: false, functional: false },
): Promise<void> {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value)
    },
    [CONSENT_STORAGE_KEY, JSON.stringify({ version, ...choice })] as const,
  )
}
