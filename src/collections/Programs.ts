import type { CollectionConfig, Field } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from './fields/iconField'
import { tariffRowFields } from './fields/tariffRowFields'

export const Programs: CollectionConfig = {
  slug: 'programs',
  labels: { singular: 'Программа 1С', plural: 'Программы 1С' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Продукты',
  },
  // Local API ходит мимо access-контроля, поэтому на локальной разработке
  // отсутствие этой строки незаметно — до первого fetch с клиента
  access: { read: () => true },

  /**
   * Сброс кеша при правке. Без него страницы остаются в том виде, в каком
   * их собрал `next build`, и правка в админке не появляется на сайте —
   * это ломает главное требование проекта.
   *
   * Проверка disableRevalidate обязательна: revalidatePath живёт только внутри
   * запроса Next, а сид — обычный процесс Node. Без флага `pnpm seed:programs`
   * падает на первом же создании документа.
   */
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        if (req?.context?.disableRevalidate) return
        // Тип 'layout' сбрасывает и шапку раздела с табами, и все страницы
        // под /programs — иначе новая программа не появится в табах
        revalidatePath('/programs', 'layout')
        revalidatePath(`/programs/${doc.slug}`)
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/programs', 'layout')
      },
    ],
  },

  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', label: 'Название', required: true },
        {
          name: 'slug',
          type: 'text',
          label: 'Слаг',
          required: true,
          unique: true,
          index: true,
          admin: { description: 'Адрес страницы: /programs/слаг' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'tabLabel',
          type: 'text',
          label: 'Подпись вкладки',
          required: true,
          admin: { description: 'В табах текст короче, чем в заголовке' },
        },
        {
          name: 'order',
          type: 'number',
          label: 'Порядок',
          required: true,
          admin: { description: 'Порядок вкладок слева направо' },
        },
      ],
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Лид под заголовком',
      required: true,
    },
    {
      name: 'bodyStrong',
      type: 'text',
      label: 'Выделенное начало',
      required: true,
      admin: { description: 'Название программы. Выводится полужирным' },
    },
    {
      name: 'bodyIntro',
      type: 'textarea',
      label: 'Продолжение первого предложения',
      required: true,
      admin: { description: 'Идёт сразу после выделенного начала, в том же абзаце' },
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Основной текст',
      required: true,
      admin: { description: 'Абзацы разделяются переводом строки' },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст кнопки',
      defaultValue: 'Оставить заявку',
    },

    // ---------- Коротко о сервисе ----------
    {
      name: 'shortFacts',
      type: 'group',
      label: 'Коротко о сервисе',
      fields: [
        {
          name: 'items',
          type: 'array',
          label: 'Факты',
          labels: { singular: 'Факт', plural: 'Факты' },
          maxRows: 3,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'fact', type: 'text', label: 'Факт', required: true },
                {
                  name: 'caption',
                  type: 'text',
                  label: 'Расшифровка',
                  required: true,
                  admin: { description: 'Не длиннее 5 слов' },
                },
              ],
            },
          ],
        },
        {
          name: 'suits',
          type: 'text',
          label: 'Подходит',
          admin: { description: 'Продолжение фразы «Подходит: …»' },
        },
      ],
    },

    // ---------- Карточки ----------
    {
      name: 'cardsTitle',
      type: 'text',
      label: 'Заголовок блока карточек',
      admin: { description: 'Без двоеточия в конце' },
    },
    {
      name: 'cardsLayout',
      type: 'select',
      label: 'Раскладка карточек',
      defaultValue: 'icon',
      options: [
        { value: 'icon', label: 'Иконка и текст' },
        { value: 'title', label: 'Заголовок и текст' },
        { value: 'icon-title', label: 'Иконка, заголовок и текст' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Карточки',
      labels: { singular: 'Карточка', plural: 'Карточки' },
      admin: {
        description: 'Пустой список — блок карточек не выводится на сайте',
      },
      fields: [
        {
          type: 'row',
          fields: [
            iconField({ required: false }),
            { name: 'title', type: 'text', label: 'Заголовок' },
          ],
        },
        { name: 'text', type: 'textarea', label: 'Текст', required: true },
        {
          name: 'list',
          type: 'array',
          label: 'Список внутри карточки',
          labels: { singular: 'Пункт', plural: 'Пункты' },
          fields: [{ name: 'text', type: 'text', label: 'Пункт', required: true }],
        },
      ],
    },

    // ---------- Таблица тарифов ----------
    {
      name: 'hasTable',
      type: 'checkbox',
      label: 'Есть таблица тарифов',
      defaultValue: false,
    },
    {
      name: 'table',
      type: 'group',
      label: 'Таблица тарифов',
      admin: { condition: (data) => Boolean(data?.hasTable) },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок таблицы' },
        {
          name: 'firstColumnLabel',
          type: 'text',
          label: 'Название первой колонки',
          admin: { description: '«Возможности», «По подсистемам», «Сервисы ИТС»' },
        },
        {
          type: 'row',
          fields: [
            { name: 'col1Label', type: 'text', label: 'Колонка 1' },
            { name: 'col2Label', type: 'text', label: 'Колонка 2' },
            {
              name: 'col3Label',
              type: 'text',
              label: 'Колонка 3',
              admin: { description: 'Пусто — колонка не выводится' },
            },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Строки',
          labels: { singular: 'Строка', plural: 'Строки' },
          fields: tariffRowFields(),
        },
        {
          name: 'hasDetails',
          type: 'checkbox',
          label: 'Есть секция «Детально»',
          defaultValue: false,
        },
        {
          name: 'detailsLabel',
          type: 'text',
          label: 'Подпись секции',
          defaultValue: 'Детально',
          admin: { condition: (_, sibling) => Boolean(sibling?.hasDetails) },
        },
        {
          name: 'detailsRows',
          type: 'array',
          label: 'Строки секции «Детально»',
          labels: { singular: 'Строка', plural: 'Строки' },
          admin: { condition: (_, sibling) => Boolean(sibling?.hasDetails) },
          fields: tariffRowFields(),
        },
      ],
    },
  ],
}
