import React from 'react'
import './styles.css'
import { Montserrat } from 'next/font/google'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { LeadModalProvider } from '@/components/lead/LeadModalProvider'

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
          {children}
        <Footer />
        </LeadModalProvider>
      </body>
    </html>
  )
}


