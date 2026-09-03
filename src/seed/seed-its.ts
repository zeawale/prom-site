import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Контент страницы /its. Тексты сняты с макета, цифры сверены
 * с v8.1c.ru/its/docs/prof-vs-techno/ — расходятся только там, где в макете
 * наша услуга, а не сервис 1С («До 3-х» — сколько типовых баз обновляем мы).
 *
 * Правки против макета, сделанные сознательно:
 *  — расставлены ё («подключённые», «1С-Отчётность»);
 *  — «5000 карточек» → «5 000 карточек», как в соседней ячейке;
 *  — убран пробел перед точкой в пункте 06.
 */

/** Строка таблицы: title сервиса в каталоге, если строка кликабельная */
type Row = {
  label: string
  service?: string
  col1: 'yes' | 'no' | 'text'
  col2: 'yes' | 'no' | 'text'
  col1Text?: string
  col2Text?: string
}

const ROWS: Row[] = [
  {
    label: 'Обновление типовых (без изменений) информационных баз',
    col1: 'text',
    col1Text: 'До 3-х',
    col2: 'text',
    col2Text: 'Доступ к обновлениям',
  },
  { label: '1С-Отчётность', service: '1С-Отчётность', col1: 'yes', col2: 'no' },
  { label: '1С:Контрагент', service: '1С:Контрагент', col1: 'yes', col2: 'no' },
  // Фреша в каталоге нет — у него отдельная страница. Ссылку поставим,
  // когда появится /fresh
  { label: '1С:Фреш (1С через Интернет)', col1: 'yes', col2: 'no' },
  {
    label: 'Сервисы 1С-ЭДО / 1С-Такском',
    service: '1С-ЭДО',
    col1: 'text',
    col1Text: '100 комплектов документов',
    col2: 'text',
    col2Text: '50 комплектов документов',
  },
  {
    label: 'Информационная система 1С:ИТС',
    service: 'Информационная система 1С:ИТС',
    col1: 'yes',
    col2: 'text',
    col2Text: 'ограниченный доступ',
  },
  { label: '1С-Коннект', service: '1С-Коннект', col1: 'yes', col2: 'yes' },
  { label: '1С:Сверка', service: '1С:Сверка 2.0', col1: 'yes', col2: 'yes' },
  { label: '1С:ДиректБанк', service: '1С:ДиректБанк', col1: 'yes', col2: 'yes' },
  {
    label: '1С:Бизнес-сеть. Торговая площадка',
    service: '1С:Бизнес-сеть. Торговая площадка',
    col1: 'yes',
    col2: 'yes',
  },
  {
    label: 'ЭДО без электронной подписи для участников Бизнес-Сети',
    service: 'ЭДО без электронной подписи для участников 1С:Бизнес-сеть',
    col1: 'yes',
    col2: 'yes',
  },
  { label: '1С:Облачный архив', service: '1С:Облачный архив', col1: 'yes', col2: 'no' },
  { label: '1С:Лекторий', service: '1С:Лекторий', col1: 'yes', col2: 'no' },
  { label: '1С:Линк', service: '1С:Линк', col1: 'yes', col2: 'no' },
  {
    label: '1С:Номенклатура',
    service: '1С:Номенклатура',
    col1: 'text',
    col1Text: '10 000 карточек',
    col2: 'text',
    col2Text: '5 000 карточек',
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  // Связываем строки с карточками каталога по названию. Не падаем на промахе:
  // строка просто останется текстом, а список несовпадений печатается ниже
  const wanted = [...new Set(ROWS.map((r) => r.service).filter(Boolean))] as string[]
  const found = await payload.find({
    collection: 'services',
    where: { title: { in: wanted } },
    limit: 100,
    depth: 0,
  })

  const idByTitle = new Map<string, number>()
  for (const doc of found.docs) idByTitle.set(doc.title, doc.id as number)

  const missing = wanted.filter((t) => !idByTitle.has(t))
  if (missing.length) {
    console.warn(`Не найдены в каталоге (строки останутся без ссылки):\n  ${missing.join('\n  ')}`)
  }

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'its',
    data: {
      title: '1С:ИТС',
      lead: 'Подписка на сопровождение от фирмы «1С»: легальные обновления, консультации и набор сервисов в одном договоре.',

      bodyStrong: 'ИТС (Информационно-технологическое сопровождение)',
      bodyIntro:
        '— это комплекс услуг и полезных сервисов от фирмы «1С», гарантирующий актуальность и работоспособность программы.',
      body: 'Вы сами выбираете, какие сервисы подключить, и платите только за то, что реально нужно вашему бизнесу.',
      ctaText: 'Заказать',

      shortFacts: {
        items: [
          { fact: '2 тарифа', caption: 'ПРОФ и Техно, отличаются объёмом поддержки' },
          { fact: 'Обновления', caption: 'ставим мы в тарифе ПРОФ, вам ничего делать не нужно' },
          { fact: '1 юрлицо', caption: 'отчётность через интернет включена в ПРОФ' },
        ],
        suits: 'всем, у кого есть купленная 1С версии ПРОФ или КОРП',
      },

      cardsTitle: 'Кому подходит 1С:ИТС',
      cards: [
        {
          icon: 'report',
          title: 'Бухгалтериям',
          text: 'Для обновлений, отчётности, календаря бухгалтера и консультаций.',
        },
        {
          icon: 'gear',
          title: 'Малому бизнесу',
          text: 'Для стабильной работы 1С без лишней нагрузки на сотрудников.',
        },
        {
          icon: 'cart',
          title: 'Торговым компаниям',
          text: 'Для ЭДО, обмена документами и проверки контрагентов.',
        },
        {
          icon: 'shield',
          title: 'Руководителям',
          text: 'Для снижения рисков, защиты данных и контроля учётной системы.',
        },
      ],

      included: {
        title: 'Что входит в сопровождение',
        items: [
          {
            title: 'Обновления 1С',
            text: 'Помогаем получать и устанавливать актуальные релизы программ 1С.',
          },
          { title: '1С-Отчётность', text: 'Сдача отчётности прямо из 1С без выгрузки файлов.' },
          {
            title: '1С-ЭДО',
            text: 'Обмен юридически значимыми электронными документами с контрагентами.',
          },
          {
            title: 'Проверка контрагентов',
            text: 'Автозаполнение реквизитов по ИНН и проверка данных.',
          },
          {
            title: 'Резервное копирование',
            text: 'Защита баз 1С с помощью облачного архива.',
          },
          { title: 'Консультации', text: 'Помощь по работе с программами 1С и сервисами.' },
        ],
      },

      table: {
        title: 'Сервисы, подключённые к 1С:ИТС',
        firstColumnLabel: 'Сервисы ИТС',
        col1Label: '1С:ИТС ПРОФ',
        col2Label: '1С:ИТС Техно',
        rows: ROWS.map(({ service, ...row }) => ({
          ...row,
          service: service ? (idByTitle.get(service) ?? null) : null,
        })),
      },

      ctaBanner: {
        title: 'Полный каталог сервисов 1С',
        text: 'В экосистему «1С:ИТС» входит более 60 сервисов — отчётность, ЭДО, маркировка, проверка контрагентов, кадровый документооборот, приём оплат. Часть из них включена в тариф, остальные подключаются отдельно.',
        buttonLabel: 'Смотреть все сервисы',
        buttonHref: '/services',
      },
    },
  })

  console.log(`Страница /its записана. Строк в таблице: ${ROWS.length}`)
  console.log(
    `Из них со ссылкой на каталог: ${ROWS.filter((r) => r.service && idByTitle.get(r.service)).length}`,
  )
  process.exit(0)
}

process.on('unhandledRejection', (e) => {
  console.error('UNHANDLED REJECTION:', e)
  process.exit(1)
})

seed().catch((e) => {
  console.error('ОШИБКА В SEED:', e)
  process.exit(1)
})
