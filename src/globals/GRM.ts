import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'

/**
 * Страница /grm целиком.
 *
 * Заметно короче Fresh: уникальных блоков нет вообще. Тарифных карточек,
 * раскрывашки «Ещё три тарифа», блока «Одинаково во всех тарифах» и плашки
 * смены тарифа у ГРМ на странице нет — оплата помесячная за место, и
 * сравнивать нечего. Блок «1С:Фреш или 1С:ГРМ» живёт в общем глобале
 * FreshVsGrm, страница берёт его тем же запросом, что и /fresh.
 *
 * Схема — подмножество Fresh, а не общий базовый объект: наследование полей
 * между глобалами в Payload означает один объект на двоих, которому конфиг
 * дописывает служебные свойства. Та же причина, по которой tariffRowFields
 * и iconField сделаны фабриками.
 */
export const GRM: GlobalConfig = {
  slug: 'grm',
  label: 'Страница «1С:ГРМ»',
  admin: { group: 'Продукты' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/grm')
      },
    ],
  },

  fields: [
    // ---------- Шапка ----------
    { name: 'title', type: 'text', label: 'Заголовок H1', required: true },
    { name: 'lead', type: 'textarea', label: 'Лид под заголовком', required: true },

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
      // У Фреша это поле обязательное, здесь — нет: в макете описание ГРМ
      // укладывается в один абзац, и требовать второй значило бы вынуждать
      // админа выдумывать текст ради валидации формы
      name: 'body',
      type: 'textarea',
      label: 'Остальные абзацы',
      admin: { description: 'Необязательно. Абзацы разделяются переводом строки' },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'Текст оранжевой кнопки',
      defaultValue: 'Заказать',
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

    // ---------- Преимущества ----------
    {
      name: 'cardsTitle',
      type: 'text',
      label: 'Заголовок блока преимуществ',
      admin: { description: 'Без двоеточия в конце' },
    },
    {
      name: 'cardsLead',
      type: 'textarea',
      label: 'Абзац под заголовком преимуществ',
      admin: { description: 'Необязательный. Вводит список карточек' },
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Карточки преимуществ',
      labels: { singular: 'Карточка', plural: 'Карточки' },
      admin: { description: 'Раскладка всегда «иконка и текст», без заголовков' },
      fields: [
        iconField({ required: false }),
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
  ],
}
