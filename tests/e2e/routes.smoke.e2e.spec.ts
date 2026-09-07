import { test, expect, type ConsoleMessage, type Page, type Response } from '@playwright/test'

/**
 * Дымовой тест всех маршрутов сайта.
 *
 * Задача одна: поймать страницу, которая перестала открываться, — до того,
 * как это увидит заказчик. Проверяются три вещи и только они:
 *   • ответ 200;
 *   • в консоли нет ошибок (сюда попадают и ошибки гидратации React —
 *     именно так выглядел «провайдер не найден»);
 *   • ровно один непустой <h1>.
 *
 * Логику страниц тест не трогает: форма заявки, попап каталога, поиск —
 * отдельная история и отдельный файл.
 *
 * Динамические адреса берутся из API, а не из константы: список программ,
 * категорий и сервисов живёт в базе, и захардкоженный список устареет
 * первым же изменением в админке.
 */

const BASE = 'http://localhost:3000'

/** Маршруты, заданные файлами в src/app/(frontend) */
const STATIC_ROUTES = [
  '/',
  '/services',
  '/services/popular',
  '/services/new',
  '/fresh',
  '/grm',
  '/its',
  '/programs',
  '/privacy',
  '/cookie',
  '/consent',
]

/**
 * Шум, который не является поломкой страницы.
 * Список намеренно короткий: чем он длиннее, тем меньше смысла в тесте.
 *
 * favicon.ico здесь потому, что иконки у сайта нет вообще — это пункт
 * техдолга, а не сломавшийся маршрут. Появится app/icon — строку убрать,
 * и тест начнёт стеречь заодно и её.
 */
const NOISE = [/Download the React DevTools/i, /\[Fast Refresh\]/i, /favicon\.ico/i, /source ?map/i]

const isNoise = (text: string) => NOISE.some((re) => re.test(text))

/**
 * «Failed to load resource: …» браузер печатает без адреса, и такая запись
 * в отчёте бесполезна: непонятно, что именно не загрузилось. Тот же провал
 * приезжает слушателем ответов, уже с URL, — здесь глушим дубль.
 */
const isBareResourceError = (text: string) => /^Failed to load resource/i.test(text)

type Failure = { path: string; problems: string[] }

/**
 * Открывает адрес и возвращает список претензий к нему (пустой — всё хорошо).
 * Слушатели вешаются до goto и снимаются после: страница переиспользуется
 * между итерациями пакетных тестов, иначе обработчики накопятся.
 */
async function visit(page: Page, path: string): Promise<string[]> {
  const problems: string[] = []

  const onConsole = (msg: ConsoleMessage) => {
    const text = msg.text()
    if (msg.type() !== 'error') return
    if (isNoise(text) || isNoise(msg.location().url) || isBareResourceError(text)) return
    problems.push(`консоль: ${text}`)
  }
  const onPageError = (err: Error) => problems.push(`исключение на странице: ${err.message}`)

  /* Единственный способ узнать, ЧТО именно отдало 404: в консольном
     сообщении браузера адреса нет, а здесь он есть */
  const onResponse = (res: Response) => {
    if (res.status() < 400 || isNoise(res.url())) return
    problems.push(`${res.status()} на ${res.url()}`)
  }

  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  page.on('response', onResponse)

  try {
    const res = await page.goto(BASE + path, { waitUntil: 'load' })

    const status = res?.status()
    // Провал самого документа уже поймает слушатель ответов, с адресом
    if (status !== undefined && status !== 200 && status < 400) {
      problems.push(`код ответа ${status}`)
    }

    // Ошибки гидратации прилетают в консоль уже после load — даём React
    // домонтироваться, иначе тест их просто не увидит
    await page.waitForTimeout(500)

    const h1 = page.locator('h1')
    const count = await h1.count()
    if (count === 0) {
      problems.push('нет <h1>')
    } else if (count > 1) {
      problems.push(`<h1> больше одного: ${count}`)
    } else if (!(await h1.first().innerText()).trim()) {
      problems.push('<h1> пустой')
    }
  } catch (e) {
    problems.push(`не открылся: ${e instanceof Error ? e.message : String(e)}`)
  } finally {
    page.off('console', onConsole)
    page.off('pageerror', onPageError)
    page.off('response', onResponse)
  }

  return problems
}

/** Отчёт по пачке адресов: один expect на группу, но с полным списком причин */
function report(failures: Failure[]) {
  const text = failures.map((f) => `${f.path}\n    ${f.problems.join('\n    ')}`).join('\n  ')
  expect(failures.length, failures.length ? `\n  ${text}\n` : '').toBe(0)
}

async function slugs(page: Page, collection: string, query = ''): Promise<string[]> {
  const res = await page.request.get(
    `${BASE}/api/${collection}?limit=200&depth=0&pagination=false${query}`,
  )
  expect(res.ok(), `не отвечает /api/${collection}`).toBe(true)
  const data = await res.json()
  return (data.docs ?? []).map((d: { slug: string }) => d.slug)
}

test.describe('Дымовой тест маршрутов', () => {
  // Первое открытие каждой страницы в dev-режиме — это её компиляция,
  // штатные 30 секунд на тест здесь ни о чём
  test.describe.configure({ timeout: 180_000 })

  for (const path of STATIC_ROUTES) {
    test(`статический маршрут ${path}`, async ({ page }) => {
      const problems = await visit(page, path)
      expect(problems, `${path}: ${problems.join('; ')}`).toEqual([])
    })
  }

  test('страницы программ', async ({ page }) => {
    const list = await slugs(page, 'programs')
    expect(list.length, 'в базе нет ни одной программы').toBeGreaterThan(0)

    const failures: Failure[] = []
    for (const slug of list) {
      const path = `/programs/${slug}`
      const problems = await visit(page, path)
      if (problems.length) failures.push({ path, problems })
    }
    report(failures)
  })

  test('страницы категорий каталога', async ({ page }) => {
    const list = await slugs(page, 'categories')
    expect(list.length, 'в базе нет ни одной категории').toBeGreaterThan(0)

    const failures: Failure[] = []
    for (const slug of list) {
      const path = `/services/${slug}`
      const problems = await visit(page, path)
      if (problems.length) failures.push({ path, problems })
    }
    report(failures)
  })

  test('страницы сервисов — по одной из каждой категории', async ({ page }) => {
    const res = await page.request.get(
      `${BASE}/api/services?limit=200&depth=1&pagination=false&where[isHidden][not_equals]=true`,
    )
    expect(res.ok(), 'не отвечает /api/services').toBe(true)
    const { docs } = (await res.json()) as {
      docs: { slug: string; category?: { slug?: string } | null }[]
    }

    // По одному представителю на категорию: полный прогон 61 страницы
    // ничего нового не ловит, а время теста утраивает
    const byCategory = new Map<string, string>()
    for (const s of docs) {
      const cat = s.category?.slug
      if (cat && !byCategory.has(cat)) byCategory.set(cat, s.slug)
    }
    expect(byCategory.size, 'ни один сервис не привязан к категории').toBeGreaterThan(0)

    const failures: Failure[] = []
    for (const [cat, slug] of byCategory) {
      const path = `/services/${cat}/${slug}`
      const problems = await visit(page, path)
      if (problems.length) failures.push({ path, problems })
    }
    report(failures)
  })
})
