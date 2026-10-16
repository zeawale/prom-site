import type { FaqItem } from '@/components/product/Faq'

type Props = {
  items: FaqItem[]
}

/**
 * Разметка Schema.org FAQPage для блока «Вопросы и ответы».
 *
 * Те же вопросы, что видит посетитель в аккордеоне Faq, — поисковики
 * требуют, чтобы размеченный текст был на странице. Ответ закрыт в
 * аккордеоне, но лежит в разметке всегда, так что условие выполняется.
 *
 * Отдельный серверный компонент, а не часть Faq: Faq клиентский, а
 * разметке незачем ехать в клиентский бандл.
 */
export function FaqJsonLd({ items }: Props) {
  if (!items.length) return null

  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <script
      type="application/ld+json"
      // Экранирование «<»: строка из CMS не должна закрыть тег script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
