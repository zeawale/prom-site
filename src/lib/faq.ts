import type { FaqItem } from '@/components/product/Faq'

type FaqGroup =
  | {
      title?: string | null
      items?: { question: string; answer: string }[] | null
    }
  | null
  | undefined

/** Группа faq из Payload → заголовок и плоский список для Faq и FaqJsonLd */
export function toFaq(faq: FaqGroup): { title: string; items: FaqItem[] } {
  return {
    title: faq?.title || 'Вопросы и ответы',
    items: (faq?.items ?? []).map(({ question, answer }) => ({ question, answer })),
  }
}
