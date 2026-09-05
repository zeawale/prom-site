import React from 'react'
import './styles.css'
import localFont from 'next/font/local'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeadModalProvider } from '@/components/lead/LeadModalProvider'
import { ServiceModalProvider } from '@/components/catalog/ServiceModalProvider'

/**
 * Montserrat берётся из npm-пакета, а не через next/font/google.
 *
 * next/font/google качает файлы на этапе сборки и дальше самохостит — в
 * рантайме к Google никто не ходит, и требование локализации ПДн он не
 * нарушал. Ломается другое: если при сборке до fonts.googleapis.com нет
 * маршрута, Next не падает, а печатает warning и собирает проект с
 * системным шрифтом. На российском хостинге это молчаливый способ
 * выкатить сайт не тем шрифтом. Пакет из npm-реестра, который и так
 * нужен для установки зависимостей, делает сборку детерминированной.
 *
 * Два вызова, а не два src в одном: fontsource отдаёт сабсеты отдельными
 * файлами, а next/font/local не умеет задавать unicode-range на файл.
 * Два файла с одинаковыми дескрипторами внутри одного семейства — это
 * не «кириллица плюс латиница», а два конкурирующих объявления, из
 * которых браузер оставит последнее.
 *
 * Поэтому семейства разные, а разводит их обычный шрифтовой фолбэк: он
 * работает поглифно. Кириллический сабсет латиницы не содержит, значит
 * на латинских символах браузер сам уходит к следующему семейству в
 * font-family. Порядок в токене --font-family это и задаёт.
 */
/* Опции продублированы, а не вынесены в общий объект: next/font разбирает
   аргументы статически на этапе сборки и спред развернуть не может —
   падает с "Unexpected spread". По той же причине сюда нельзя передать
   переменную или результат вызова, только литералы.
   weight: '100 900' — вариативная ось wght целиком, 400/500/600/700 внутри */
const montserratCyrillic = localFont({
  src: '../../../node_modules/@fontsource-variable/montserrat/files/montserrat-cyrillic-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-montserrat',
})

const montserratLatin = localFont({
  src: '../../../node_modules/@fontsource-variable/montserrat/files/montserrat-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-montserrat-latin',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${montserratCyrillic.variable} ${montserratLatin.variable}`}>
      <body>
        <LeadModalProvider>
          <Header />
          <ServiceModalProvider>{children}</ServiceModalProvider>
          <Footer />
        </LeadModalProvider>
      </body>
    </html>
  )
}
