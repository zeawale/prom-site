import React from 'react'
import './styles.css'
import { Montserrat } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeadModalProvider } from '@/components/lead/LeadModalProvider'
import { ServiceModalProvider } from '@/components/catalog/ServiceModalProvider'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={montserrat.variable}>
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
