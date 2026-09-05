import type { Metadata } from 'next'
import { getGrm, getFreshVsGrm } from '@/lib/queries'
import { RequestButton } from '@/components/layout/RequestButton'
import PageHero from '@/components/product/PageHero'
import ProductIntro from '@/components/product/ProductIntro'
import FeatureCards from '@/components/product/FeatureCards'
import CompareBlock from '@/components/product/CompareBlock'

// Своего layout нет, как у /its и /fresh — <main> и .container рендерит страница

export async function generateMetadata(): Promise<Metadata> {
  const grm = await getGrm()
  return {
    title: `${grm.title} — аренда 1С в облаке партнёра | ПРО-М`,
    description: grm.lead,
  }
}

export default async function GrmPage() {
  // Settings здесь не нужен: тарифной таблицы у ГРМ нет, значит нет и
  // дисклеймера под ней — единственное, ради чего его тянет /fresh
  const [grm, compare] = await Promise.all([getGrm(), getFreshVsGrm()])

  // Payload хранит строки массива записями с id, компоненту нужен плоский текст
  const cards = (grm.cards ?? []).map((card) => ({
    icon: card.icon ?? null,
    title: null,
    text: card.text,
    list: (card.list ?? []).map((item) => item.text),
  }))

  return (
    <main className="container">
      <PageHero title={grm.title} lead={grm.lead} level={1} />

      <ProductIntro
        id="grm"
        bodyStrong={grm.bodyStrong}
        bodyIntro={grm.bodyIntro}
        // У ГРМ поле необязательное: в макете описание в один абзац.
        // ProductIntro всегда зовёт split, пустая строка даёт пустой список
        body={grm.body ?? ''}
        facts={grm.shortFacts?.items ?? []}
        suits={grm.shortFacts?.suits}
        // Одна кнопка, как на /its и /fresh. В макете их две, но вторая
        // («Подробнее о тарифах») вела бы в никуда: тарифной таблицы
        // на странице ГРМ нет
        cta={<RequestButton source="grm">{grm.ctaText ?? 'Заказать'}</RequestButton>}
      />

      <FeatureCards
        id="grm"
        title={grm.cardsTitle}
        lead={grm.cardsLead}
        layout="icon"
        cards={cards}
      />

      {compare && (
        <CompareBlock
          title={compare.title}
          lead={compare.lead}
          fresh={compare.fresh}
          grm={compare.grm}
          current="grm"
        />
      )}
    </main>
  )
}
