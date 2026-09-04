import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProgram, getPrograms, getProgramsSection, getSettings } from '@/lib/queries'
import { toRows } from '@/lib/programs'
import { RequestButton } from '@/components/layout/RequestButton'
import PageHero from '@/components/product/PageHero'
import ProductIntro from '@/components/product/ProductIntro'
import FeatureCards from '@/components/product/FeatureCards'
import TariffTable from '@/components/product/TariffTable'

// <main> и .container живут в programs/layout.tsx — здесь их быть не должно.

export async function generateStaticParams() {
  const programs = await getPrograms()
  return programs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgram(slug)

  if (!program) return {}

  return {
    title: `${program.title} — купить в Нижнем Новгороде | ПРО-М`,
    description: program.lead,
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [program, section, settings] = await Promise.all([getProgram(slug), getProgramsSection(), getSettings()])

  if (!program) notFound()

  // Массивы в Payload — записи с id, компонентам нужны плоские строки
  const cards = (program.cards ?? []).map((card) => ({
    icon: card.icon ?? null,
    title: card.title ?? null,
    text: card.text,
    list: (card.list ?? []).map((item) => item.text),
  }))

  // hasTable управляет видимостью группы в админке, но саму группу Payload
  // хранит всегда — поэтому проверяем флаг, а не наличие объекта
  const table = program.hasTable ? program.table : null

  // Колонок 2 или 3: пустая метка означает, что колонки нет
  const columns = [table?.col1Label, table?.col2Label, table?.col3Label].filter(
    (label): label is string => Boolean(label),
  )

  return (
    <>
      {/* level=2: h1 занят шапкой раздела */}
      <PageHero title={program.title} lead={program.lead} level={2} />

      <ProductIntro
        id={program.slug}
        bodyStrong={program.bodyStrong}
        bodyIntro={program.bodyIntro}
        body={program.body}
        facts={program.shortFacts?.items ?? []}
        suits={program.shortFacts?.suits}
        cta={
          <RequestButton source={`program:${program.slug}`}>
            {program.ctaText ?? 'Оставить заявку'}
          </RequestButton>
        }
      />

      <FeatureCards
        id={program.slug}
        title={program.cardsTitle}
        layout={program.cardsLayout ?? 'icon'}
        cards={cards}
      />

      {table && columns.length > 0 && (
        <TariffTable
          id={program.slug}
          title={table.title}
          firstColumnLabel={table.firstColumnLabel ?? ''}
          columns={columns}
          rows={toRows(table.rows ?? [], columns.length)}
          disclaimer={settings.tariffDisclaimer}
          details={
            table.hasDetails
              ? {
                  label: table.detailsLabel ?? 'Детально',
                  rows: toRows(table.detailsRows ?? [], columns.length),
                }
              : null
          }
          
        />
      )}
    </>
  )
}
