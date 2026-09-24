/**
 * Адреса старого сайта на WordPress (обследован 15.09.2026).
 *
 * Два списка и одно правило: у адреса либо есть настоящий преемник — тогда
 * 301, либо его нет — тогда 410. Редирект на нерелевантную страницу
 * (например, на главную) поисковики считают мягкой 404: рейтинг по нему
 * не передаётся, а индекс засоряется. 410 говорит прямо: страницы больше
 * нет, из индекса её можно убирать.
 *
 * Ключи — путь без завершающего слэша и в нижнем регистре; так их
 * нормализует proxy перед поиском. Значения — путь на новом сайте.
 *
 * Список редиректов и удалённых разделов — по карте сайта и меню старого
 * сайта. Карта там неполная (см. мастер-промт), полный перечень адресов
 * ждём из админки WordPress и Вебмастера — дополнять сюда.
 */

/** Старый адрес → новый. Только там, где преемник отвечает на тот же запрос */
export const LEGACY_REDIRECTS: Record<string, string> = {
  // /about/ → /about в таблице не нужен: слэш в конце снимает proxy сам
  '/kontakty': '/contacts',
  '/servisy-1s': '/services',
  '/1c-fresh': '/fresh',
  '/obsluzhivanie-i-dorabotka-1s': '/its',
  // Отзывы теперь живут на «О компании»
  '/klienty': '/about',

  // Раздел программ. Корень /programs сам редиректит на первую программу,
  // а редирект должен быть одним переходом — поэтому сразу на неё
  '/programmy-1s': '/programs/buhgalteriya',
  '/programmy-1s/1s-buxgalteriya-8': '/programs/buhgalteriya',
  '/programmy-1s/1s-erp-upravlenie-predpriyatiem': '/programs/erp',
  '/programmy-1s/1s-kompleksnaya-avtomatizaciya-8': '/programs/kompleksnaya-avtomatizatsiya',
  '/programmy-1s/1s-roznica': '/programs/roznitsa',
  '/programmy-1s/1s-upravlenie-torgovlej': '/programs/upravlenie-torgovley',
  '/programmy-1s/1s-zarplata-i-upravlenie-personalom-8': '/programs/zup',
  '/programmy-1s/1s-licenzii': '/programs/litsenzii',

  // Страницы про 1С из меню старого сайта, которых не было в карте.
  // Доработка и сопровождение — это /its; «купить 1С» — раздел программ
  '/dorabotka-1s': '/its',
  '/stoimost-soprovozhdeniya-1s': '/its',
  '/kupit-1s': '/programs/buhgalteriya',
}

/**
 * Разделы, которые на новый сайт не переехали (решение 15.09.2026:
 * ИТ-аутсорсинг, новости, акции, вакансии, галерея, мусор темы) плюс
 * служебные пути WordPress. Совпадение по префиксу: /uslugi/... целиком.
 */
export const LEGACY_GONE_PREFIXES: string[] = [
  // ИТ-аутсорсинг
  '/uslugi',
  '/features',
  '/obsluzhivanie-lokalnyx-setej',
  '/lvs-lokalnaya-vychislitelnaya-set',
  '/obsluzhivanie-serverov',
  '/sks-strukturirovannaya-kabelnaya-sistema',
  '/videonablyudenie',
  '/obshhie-profilakticheskie-raboty',
  '/obshhie-profilakticheskie-raboty-2',
  '/obsluzhivanie-orgtexniki',
  '/informacionnaya-bezopasnost',
  '/podderzhka-polzovatelej',
  '/kontrol-dostupa',
  '/soprovozhdenie-informacionnyx-sistem',
  '/nastrojka-programmy-1s-pod-osobennosti-ucheta-na-predpriyatii-klienta',
  '/1c',
  // Разделы, которых на новом сайте нет
  '/novosti',
  '/akcii',
  '/vakansii',
  '/video',
  '/gallery',
  // Мусор темы из старой карты сайта
  '/coming-soon',
  '/contact-us',
  // Служебное WordPress: боты и старая выдача будут стучаться сюда годами.
  // Пути с расширением (wp-login.php, xmlrpc.php) сюда не входят: их
  // отсекает матчер proxy, они получают обычную 404
  '/wp-content',
  '/wp-includes',
  '/wp-admin',
  '/wp-json',
  '/feed',
  '/category',
  '/tag',
  '/author',
  '/page',
]

/** Путь как в запросе → ключ для таблиц выше: без слэша в конце, в нижнем регистре */
export function normalizeLegacyPath(pathname: string): string {
  const lower = pathname.toLowerCase()
  return lower.length > 1 ? lower.replace(/\/+$/, '') : lower
}

export function isLegacyGone(normalized: string): boolean {
  return LEGACY_GONE_PREFIXES.some((p) => normalized === p || normalized.startsWith(`${p}/`))
}
