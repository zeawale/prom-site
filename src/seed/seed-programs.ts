/**
 * Сид программ 1С и глобала раздела.
 * Запуск из корня проекта: pnpm seed:programs
 *
 * --env-file обязателен. Вариант «импортировать dotenv первой строкой» не
 * работает: в ESM все импорты выполняются раньше кода между ними.
 *
 * Скрипт идемпотентен — чистит programs перед заливкой.
 */

import { getPayload } from 'payload'
import config from '@payload-config'
import type { IconName } from '@/lib/icons'
import raw from './1c_programs.json'

type Cell = 'yes' | 'no' | 'text'

type JsonRow = {
  label: string
  col1?: Cell
  col2?: Cell
  col3?: Cell
  col1_text?: string
  col2_text?: string
  col3_text?: string
}

type JsonProgram = {
  slug: string
  order: number
  tab_label: string
  title: string
  lead: string
  body_strong: string
  body_intro: string
  body: string
  cta_text: string
  short_facts: { items: { fact: string; caption: string }[]; suits: string }
  cards_title: string | null
  cards_layout: 'icon' | 'title' | 'icon-title' | null
  // IconName, а не string: Payload выводит из select union конкретных значений.
  // Соответствие JSON и ICONS проверяет check-icons.ts, так что сужение
  // здесь — уточнение проверенного факта, а не обман компилятора.
  cards: { icon?: IconName; title?: string; text: string; list?: string[] }[]
  table: {
    title: string
    first_column_label: string
    columns: string[]
    rows: JsonRow[]
    details: { label: string; rows: JsonRow[] } | null
  } | null
}

const data = raw as unknown as {
  section: {
    title: string
    lead: string
    cloud_banner: {
      title: string
      text: string
      buttons: { label: string; href: string; style: 'primary' | 'accent' }[]
    }
    tariff_disclaimer: string
  }
  programs: JsonProgram[]
}

/** Плоских массивов в Payload не бывает: каждая строка — запись со своим id */
const toTextArray = (items?: string[]) => (items ?? []).map((text) => ({ text }))

const mapRow = (r: JsonRow) => ({
  label: r.label,
  col1: r.col1 ?? 'no',
  col2: r.col2 ?? 'no',
  col3: r.col3 ?? 'no',
  col1Text: r.col1_text ?? undefined,
  col2Text: r.col2_text ?? undefined,
  col3Text: r.col3_text ?? undefined,
})

const run = async () => {
  const payload = await getPayload({ config })

  // context отключает хук ревалидации: revalidatePath работает только внутри
  // запроса Next, а сид — обычный процесс Node
  await payload.delete({
    collection: 'programs',
    where: {},
    context: { disableRevalidate: true },
  })
  console.log('Коллекция programs очищена')

  for (const p of data.programs) {
    const t = p.table

    await payload.create({
      collection: 'programs',
      data: {
        title: p.title,
        slug: p.slug,
        tabLabel: p.tab_label,
        order: p.order,
        lead: p.lead,
        bodyStrong: p.body_strong,
        bodyIntro: p.body_intro,
        body: p.body,
        ctaText: p.cta_text,
        shortFacts: {
          items: p.short_facts.items,
          suits: p.short_facts.suits,
        },
        cardsTitle: p.cards_title ?? undefined,
        cardsLayout: p.cards_layout ?? 'icon',
        cards: p.cards.map((c) => ({
          icon: c.icon ?? undefined,
          title: c.title ?? undefined,
          text: c.text,
          list: toTextArray(c.list),
        })),
        hasTable: Boolean(t),
        table: t
          ? {
              title: t.title,
              firstColumnLabel: t.first_column_label,
              col1Label: t.columns[0] ?? '',
              col2Label: t.columns[1] ?? '',
              // Пустая строка, а не undefined: фронт считает колонки
              // по непустым меткам
              col3Label: t.columns[2] ?? '',
              rows: t.rows.map(mapRow),
              hasDetails: Boolean(t.details),
              detailsLabel: t.details?.label ?? 'Детально',
              detailsRows: (t.details?.rows ?? []).map(mapRow),
            }
          : undefined,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const rowCount = t ? t.rows.length + (t.details?.rows.length ?? 0) : 0
    console.log(`  ${p.slug}: карточек ${p.cards.length}, строк таблицы ${rowCount}`)
  }

  await payload.updateGlobal({
    slug: 'programs-section',
    data: {
      title: data.section.title,
      lead: data.section.lead,
      cloudBanner: {
        title: data.section.cloud_banner.title,
        text: data.section.cloud_banner.text,
        buttons: data.section.cloud_banner.buttons,
      },
      tariffDisclaimer: data.section.tariff_disclaimer,
    },
    context: { disableRevalidate: true },
  })

  console.log(`\nГотово: ${data.programs.length} программ, глобал обновлён`)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})