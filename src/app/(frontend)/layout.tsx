import React from 'react'
import './styles.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeadModalProvider } from '@/components/lead/LeadModalProvider'
import { ServiceModalProvider } from '@/components/catalog/ServiceModalProvider'
import { CookieConsent } from '@/components/cookie/CookieConsent'
import { getCookieBanner } from '@/lib/queries'

/**
 * Montserrat подключается обычным CSS (см. fonts.css), а не next/font.
 *
 * История вопроса. next/font/google качает файлы на этапе сборки и дальше
 * самохостит, но если при сборке нет маршрута до fonts.googleapis.com, Next
 * не падает, а печатает warning и собирает проект с системным шрифтом. На
 * российском хостинге это молчаливый способ выкатить сайт не тем шрифтом,
 * поэтому шрифт берётся из npm-пакета.
 *
 * Дальше был next/font/local — и вот он для этой задачи не годится: задать
 * unicode-range на файл он не умеет, а fontsource отдаёт кириллицу и
 * латиницу разными файлами. Пришлось объявлять два семейства и разводить их
 * цепочкой фолбэков в --font-family. Работало это поглифно и ровно до
 * первого сбоя в цепочке, после чего латиница уезжала в системный шрифт.
 *
 * Сейчас всё штатно: одно семейство, пять сабсетов, unicode-range решает,
 * какой файл тянуть. Единственное, что next/font делал сам и что теперь
 * приходится писать руками, — preload ниже.
 */
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookie = await getCookieBanner()

  return (
    <html lang="ru">
      <head>
        {/*
          Только два сабсета из пяти: кириллица — весь текст сайта, латиница —
          цифры, «1С:ERP» и латинские названия. Остальные три подключены в CSS
          и подтянутся сами, если такой символ на странице появится.

          crossOrigin обязателен даже для своего домена: без него запрос
          preload и запрос шрифта считаются разными, и файл качается дважды.
        */}
        <link
          rel="preload"
          href="/fonts/montserrat-cyrillic-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <LeadModalProvider>
          {/* Обёртка нужна только под overflow-x: clip — см. styles.css.
              Стоит внутри провайдера, чтобы модалка заявки осталась
              снаружи обрезки */}
          <div className="viewport">
            <Header />
            <ServiceModalProvider>{children}</ServiceModalProvider>
            <Footer />
          </div>

          {/* Снаружи обёртки — плашка и её модалка position: fixed, обрезка
              по горизонтали им ни к чему, а тексты приходят из CMS */}
          <CookieConsent
            texts={{
              version: cookie.version,
              title: cookie.title,
              text: cookie.text,
              policyLabel: cookie.policyLabel,
              acceptAllLabel: cookie.acceptAllLabel,
              necessaryOnlyLabel: cookie.necessaryOnlyLabel,
              settingsLabel: cookie.settingsLabel,
              settings: {
                title: cookie.settings.title,
                necessary: cookie.settings.necessary,
                analytics: cookie.settings.analytics,
                functional: cookie.settings.functional,
                saveLabel: cookie.settings.saveLabel,
                acceptAllLabel: cookie.settings.acceptAllLabel,
              },
            }}
          />
        </LeadModalProvider>
      </body>
    </html>
  )
}
