import { getSettings } from '@/lib/queries'
import { SITE_URL } from '@/lib/site'

/**
 * Разметка Schema.org для компании: название, телефон, почта, адрес, ИНН.
 *
 * Яндекс и Google берут из неё карточку организации и контакты в
 * сниппете. Данные — из глобала Settings, того же, что у шапки и футера:
 * поправят телефон в админке — поправится и здесь.
 *
 * Адрес в Settings одной строкой «Город, улица, дом», поэтому город
 * отделяется по первой запятой. Часы работы не размечаются: в Settings
 * они свободным текстом, а openingHours требует строгого формата, и
 * разбирать текст значило бы однажды отдать поисковикам неверные часы.
 */
export async function OrganizationJsonLd() {
  const settings = await getSettings()

  const [locality, ...street] = settings.address.split(',')

  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#organization`,
    name: 'ПРО-М',
    legalName: settings.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/logos/logo-prom.svg`,
    image: `${SITE_URL}/logos/logo-prom.svg`,
    telephone: settings.phone,
    email: settings.email,
    taxID: settings.inn,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressLocality: locality.trim(),
      streetAddress: street.join(',').trim(),
    },
    areaServed: 'Нижний Новгород',
  }

  return (
    <script
      type="application/ld+json"
      // Экранирование «<»: строка из CMS не должна закрыть тег script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
