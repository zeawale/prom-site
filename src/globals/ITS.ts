import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'
import { tariffRowFields } from '../collections/fields/tariffRowFields'

/**
 * Страница /its целиком.
 *
 * Глобал, а не запись в Programs: у ИТС два блока, которых нет больше нигде —
 * нумерованный список 01–06 на синем и перелинковка на каталог. Натягивать их
 * на общую коллекцию значит завести два опциональных поля ради одного
 * использования каждого.
 */
export const ITS: GlobalConfig = {
  slug: 'its',
  label: 'Страница «1С:ИТС»',
  admin: { group: 'Продукты' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/its')
      },
    ],
  },

  fields: [
    // ---------- Шапка ----------
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок H1',
      required: true,
    },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Лид под заголовком',
      required: true,
      admin: { description: 'Не дублировать лид каталога сервисов' },
    },

    // ---------- Описание слева ----------
    {
      name: 'bodyStrong',
      type: 'text',
      label: 'Выделенное начало',
      required: true,
      admin: { description: 'Выводится полужирным, в том же абзаце' },
    },
    {
      name: 'bodyIntro',
      type: 'textarea',
      label: 'Продолжение первого предложения',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      label: 'Основной текст',
      required: true,
      admin: { description: 'Абзацы разделяются переводом строки' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          label: 'Текст оранжевой кнопки',
          defaultValue: 'Заказать',
        },
      ],
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
                { name: 'caption', type: 'text', label: 'Расшифровка', required: true },
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

    // ---------- Кому подходит ----------
    {
      name: 'cardsTitle',
      type: 'text',
      label: 'Заголовок блока карточек',
      admin: { description: 'Без двоеточия в конце' },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Карточки «Кому подходит»',
      labels: { singular: 'Карточка', plural: 'Карточки' },
      admin: { description: 'Раскладка всегда «иконка, заголовок и текст»' },
      fields: [
        {
          type: 'row',
          fields: [
            iconField(),
            { name: 'title', type: 'text', label: 'Заголовок', required: true },
          ],
        },
        { name: 'text', type: 'textarea', label: 'Текст', required: true },
      ],
    },

    // ---------- Что входит в сопровождение ----------
    {
      name: 'included',
      type: 'group',
      label: 'Что входит в сопровождение',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        {
          name: 'items',
          type: 'array',
          label: 'Пункты',
          labels: { singular: 'Пункт', plural: 'Пункты' },
          maxRows: 9,
          admin: {
            description: 'Номера 01, 02, 03 рисуются индексом — в тексте их писать не надо',
          },
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок', required: true },
            { name: 'text', type: 'textarea', label: 'Текст', required: true },
          ],
        },
      ],
    },

    // ---------- Таблица ----------
    {
      name: 'table',
      type: 'group',
      label: 'Таблица «Сервисы, подключённые к 1С:ИТС»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок таблицы' },
        {
          name: 'firstColumnLabel',
          type: 'text',
          label: 'Название первой колонки',
          defaultValue: 'Сервисы ИТС',
        },
        {
          type: 'row',
          fields: [
            { name: 'col1Label', type: 'text', label: 'Колонка 1' },
            { name: 'col2Label', type: 'text', label: 'Колонка 2' },
          ],
        },
        {
          name: 'rows',
          type: 'array',
          label: 'Строки',
          labels: { singular: 'Строка', plural: 'Строки' },
          // Третья колонка на ИТС не используется: тарифа всегда два.
          // Поля col3/col3Text в схеме есть, но в админке их не показываем
          fields: tariffRowFields({ withServiceLink: true }),
        },
      ],
    },

    // ---------- Перелинковка на каталог ----------
    {
      name: 'ctaBanner',
      type: 'group',
      label: 'Блок «Полный каталог сервисов 1С»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Текст', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Подпись кнопки',
              defaultValue: 'Смотреть все сервисы',
              required: true,
            },
            {
              name: 'buttonHref',
              type: 'text',
              label: 'Ссылка',
              defaultValue: '/services',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
