import type { Metadata } from 'next'
import { getITS, getSettings } from '@/lib/queries'
import { toRows } from '@/lib/programs'
import { RequestButton } from '@/components/layout/RequestButton'
import PageHero from '@/components/product/PageHero'
import ProductIntro from '@/components/product/ProductIntro'
import FeatureCards from '@/components/product/FeatureCards'
import NumberedList from '@/components/product/NumberedList'
import TariffTable from '@/components/product/TariffTable'
import CtaBanner from '@/components/product/CtaBanner'

// В отличие от программ, у /its нет своего layout — <main> и .container
// рендерит сама страница

export async function generateMetadata(): Promise<Metadata> {
  const its = await getITS()
  return {
    title: `${its.title} — сопровождение 1С в Нижнем Новгороде | ПРО-М`,
    description: its.lead,
  }
}

export default async function ITSPage() {
  /* ProgramsSection здесь больше не нужен: дисклеймер таблиц уехал в
     Settings, а шапку раздела рисует только /programs */
  const [its, settings] = await Promise.all([getITS(), getSettings()])

  const cards = (its.cards ?? []).map((card) => ({
    icon: card.icon ?? null,
    title: card.title ?? null,
    text: card.text,
    list: [],
  }))

  const table = its.table
  // Тарифа всегда два: ПРОФ и Техно. Третьей колонки на этой странице не бывает
  const columns = [table?.col1Label, table?.col2Label].filter((label): label is string =>
    Boolean(label),
  )

  return (
    <main className="container">
      {/* level=1: у /its нет шапки раздела, H1 страницы — здесь */}
      <PageHero title={its.title} lead={its.lead} level={1} />

      <ProductIntro
        id="its"
        bodyStrong={its.bodyStrong}
        bodyIntro={its.bodyIntro}
        body={its.body}
        facts={its.shortFacts?.items ?? []}
        suits={its.shortFacts?.suits}
        // Ровно один элемент: ProductIntro клонирует его и подставляет
        // свой класс. Фрагмент или массив сюда класть нельзя
        cta={<RequestButton source="its">{its.ctaText ?? 'Заказать'}</RequestButton>}
      />

      <FeatureCards id="its" title={its.cardsTitle} layout="icon-title" cards={cards} />

      <NumberedList
        id="its"
        title={its.included?.title ?? 'Что входит в сопровождение'}
        items={its.included?.items ?? []}
      />

      {table && columns.length > 0 && (
        <TariffTable
          id="its"
          title={table.title}
          firstColumnLabel={table.firstColumnLabel ?? 'Сервисы ИТС'}
          columns={columns}
          rows={toRows(table.rows ?? [], columns.length)}
          details={null}
          disclaimer={settings.tariffDisclaimer}
        />
      )}

      {its.ctaBanner && (
        <CtaBanner
          title={its.ctaBanner.title}
          text={its.ctaBanner.text}
          buttonLabel={its.ctaBanner.buttonLabel}
          buttonHref={its.ctaBanner.buttonHref}
        />
      )}
    </main>
  )
}
