import type { Metadata } from 'next'
import { getFresh, getFreshVsGrm, getSettings } from '@/lib/queries'
import { RequestButton } from '@/components/layout/RequestButton'
import PageHero from '@/components/product/PageHero'
import ProductIntro from '@/components/product/ProductIntro'
import FeatureCards from '@/components/product/FeatureCards'
import TariffCards from '@/components/product/TariffCards'
import MoreTariffs from '@/components/product/MoreTariffs'
import NoteBox from '@/components/product/NoteBox'
import CompareBlock from '@/components/product/CompareBlock'

// Как и у /its, своего layout нет — <main> и .container рендерит страница

export async function generateMetadata(): Promise<Metadata> {
  const fresh = await getFresh()
  return {
    title: `${fresh.title} — работа в 1С через интернет | ПРО-М`,
    description: fresh.lead,
  }
}

export default async function FreshPage() {
  const [fresh, compare, settings] = await Promise.all([
    getFresh(),
    getFreshVsGrm(),
    getSettings(),
  ])

  // Payload хранит строки массива записями с id, компоненту нужен плоский текст
  const cards = (fresh.cards ?? []).map((card) => ({
    icon: card.icon ?? null,
    title: null,
    text: card.text,
    list: (card.list ?? []).map((item) => item.text),
  }))

  const commonCards = (fresh.tariffs?.common?.items ?? []).map((item) => ({
    icon: item.icon ?? null,
    title: item.title ?? null,
    text: item.text,
    list: [],
  }))

  const tariffs = fresh.tariffs
  const extra = tariffs?.extra

  return (
    <main className="container">
      <PageHero title={fresh.title} lead={fresh.lead} level={1} />

      <ProductIntro
        id="fresh"
        bodyStrong={fresh.bodyStrong}
        bodyIntro={fresh.bodyIntro}
        body={fresh.body}
        facts={fresh.shortFacts?.items ?? []}
        suits={fresh.shortFacts?.suits}
        // Одна кнопка, как на /its: ProductIntro клонирует ровно один элемент.
        // Вторая кнопка макета («Подробнее о тарифах») снята решением Ники
        cta={<RequestButton source="fresh">{fresh.ctaText ?? 'Оставить заявку'}</RequestButton>}
      />

      <FeatureCards id="fresh" title={fresh.cardsTitle} layout="icon" cards={cards} />

      {tariffs && (
        <TariffCards
          title={tariffs.title}
          lead={tariffs.lead}
          cards={tariffs.cards ?? []}
          disclaimer={settings.tariffDisclaimer}
        >
          {extra?.items?.length ? (
            <MoreTariffs
              title={extra.title}
              items={extra.items}
              bannerText={extra.banner?.text ?? ''}
              buttonLabel={extra.banner?.buttonLabel ?? 'Оставить заявку'}
            />
          ) : null}

          {commonCards.length > 0 && (
            <FeatureCards
              id="fresh-common"
              title={tariffs.common?.title}
              layout="icon-title"
              columns={4}
              headingLevel={3}
              cards={commonCards}
            />
          )}

          {tariffs.switchNote?.text && (
            <NoteBox title={tariffs.switchNote.title} text={tariffs.switchNote.text} />
          )}
        </TariffCards>
      )}

      {compare && (
        <CompareBlock
          title={compare.title}
          lead={compare.lead}
          fresh={compare.fresh}
          grm={compare.grm}
          current="fresh"
        />
      )}
    </main>
  )
}