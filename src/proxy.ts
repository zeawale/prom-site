import { NextResponse, type NextRequest } from 'next/server'
import { SITE_URL } from '@/lib/site'
import { LEGACY_REDIRECTS, isLegacyGone, normalizeLegacyPath } from '@/lib/legacy'

/**
 * Единственное место, где сайт отвечает редиректами и 410.
 *
 * Правило одно: любой старый или кривой адрес приводится к каноническому
 * ОДНИМ переходом. У домена одновременно живут http, https, www и вариант
 * без www, а у старого WordPress все адреса со слэшем в конце — цепочка
 * вида http://pm52.ru/x/ → https://pm52.ru/x/ → https://www.pm52.ru/new
 * собирается сама собой, и поисковики её переваривают плохо. Поэтому
 * протокол, домен, слэш и старый путь считаются вместе, а не по очереди.
 *
 * Отсюда же skipTrailingSlashRedirect в next.config: иначе Next снимал бы
 * слэш своим 308 до proxy, и /kontakty/ ехал бы в /contacts за два шага.
 *
 * Что здесь есть:
 *   • сведение к каноническому домену и https (только для боевого домена:
 *     localhost и превью-стенды не трогаем — иначе локальная разработка
 *     улетала бы на прод);
 *   • 301 со старых адресов на преемников — таблица в lib/legacy.ts;
 *   • 410 для удалённых разделов старого сайта — там же.
 *
 * 301, а не 308: у 308 сохраняется метод запроса, но здесь только GET, а
 * 301 понимают все клиенты и панели вебмастеров без оговорок.
 *
 * Матчер исключает служебные пути и файлы с расширением: статика, шрифты,
 * иконки, /admin и /api редиректов не требуют, а лишний проход по proxy
 * на каждый woff2 — это просто трата.
 */

const canonical = new URL(SITE_URL)
/** Домен без www, с которого сводим на канонический. Пусто, если канонический сам без www */
const bareHost = canonical.host.startsWith('www.') ? canonical.host.slice(4) : ''

const GONE_BODY = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Страница удалена | ПРО-М</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;font-family:system-ui,-apple-system,sans-serif;color:#1f2937;background:#f9fafc}
  main{max-width:560px;padding:32px 16px;text-align:center}
  h1{font-size:28px;line-height:1.3;margin:0 0 12px}
  p{font-size:16px;line-height:1.6;color:#334155;margin:0 0 24px}
  a{display:inline-block;padding:14px 28px;border-radius:20px;background:#0e4cb9;color:#fff;font-weight:600;text-decoration:none}
</style>
</head>
<body>
<main>
<h1>Этой страницы больше нет</h1>
<p>Раздел удалён при обновлении сайта. Теперь мы занимаемся только программами и сервисами 1С.</p>
<a href="/">На главную</a>
</main>
</body>
</html>
`

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? ''
  const proto =
    request.headers.get('x-forwarded-proto') ?? request.nextUrl.protocol.replace(':', '')

  const normalized = normalizeLegacyPath(pathname)

  // Удалённые разделы: отвечаем сразу, домен и слэш уже не важны
  if (isLegacyGone(normalized)) {
    return new NextResponse(GONE_BODY, {
      status: 410,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    })
  }

  const legacyTarget = LEGACY_REDIRECTS[normalized]

  // Боевой домен: либо сам канонический, либо его вариант без www
  const isProdHost = host === canonical.host || (bareHost !== '' && host === bareHost)
  const wrongHost = isProdHost && host !== canonical.host
  const wrongProto = isProdHost && proto !== canonical.protocol.replace(':', '')
  const trailingSlash = pathname.length > 1 && pathname.endsWith('/')

  if (!legacyTarget && !wrongHost && !wrongProto && !trailingSlash) {
    return NextResponse.next()
  }

  // Не боевой домен (localhost, превью) — origin оставляем как есть, чиним только путь
  const target = new URL(legacyTarget ?? normalized, isProdHost ? canonical : request.nextUrl)
  target.search = search

  return NextResponse.redirect(target, 301)
}

export const config = {
  matcher: [
    /*
      Всё, кроме: API и админки Payload, сборки Next, картинок next/image и
      любых путей с расширением файла (статика из public, шрифты, иконки,
      sitemap.xml, robots.txt)
    */
    '/((?!api|admin|_next/static|_next/image|.*\\..*).*)',
  ],
}
