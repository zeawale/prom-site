import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLegalPage } from '@/lib/queries'
import LegalDocument from '@/components/legal/LegalDocument'

const SLUG = 'consent'

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegalPage(SLUG)
  if (!doc) return { title: 'Согласие на обработку персональных данных | ПРО-М' }
  return {
    title: `${doc.title} | ПРО-М`,
    description: doc.lead,
    // Юридические страницы не должны конкурировать в выдаче с продуктовыми
    robots: { index: false, follow: true },
  }
}

export default async function ConsentPage() {
  const doc = await getLegalPage(SLUG)
  // Документа нет в базе — это 404, а не пустая страница: ссылка на него
  // стоит в футере и в форме заявки, и молчаливая пустышка хуже честной ошибки
  if (!doc) notFound()

  return (
    <LegalDocument
      title={doc.title}
      lead={doc.lead}
      effectiveDate={doc.effectiveDate}
      sections={doc.sections ?? []}
    />
  )
}
