import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'

/**
 * Страница /fresh целиком.
 *
 * Уникальных блоков четыре: тарифные карточки с метриками, раскрывашка
 * «Ещё три тарифа», «Одинаково во всех тарифах» и плашка смены тарифа.
 * Блок сравнения с ГРМ живёт в отдельном глобале — он нужен и на /grm.
 */
export const Fresh: GlobalConfig = {
  slug: 'fresh',
  label: 'Страница «1С:Фреш»',
  admin: { group: 'Продукты' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/fresh')
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
    { name: 'bodyIntro', type: 'textarea', label: 'Продолжение первого предложения', required: true },
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
          defaultValue: 'Оставить заявку',
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

    // ---------- Преимущества ----------
    {
      name: 'cardsTitle',
      type: 'text',
      label: 'Заголовок блока преимуществ',
      admin: { description: 'Без двоеточия в конце' },
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

    // ---------- Тарифы ----------
    {
      name: 'tariffs',
      type: 'group',
      label: 'Тарифы',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок', required: true },

        {
          name: 'cards',
          type: 'array',
          label: 'Основные тарифы',
          labels: { singular: 'Тариф', plural: 'Тарифы' },
          maxRows: 2,
          admin: { description: 'Ровно два: Базовый и ПРОФ. Остальные три — в раскрывашке ниже' },
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'name', type: 'text', label: 'Название', required: true },
                {
                  name: 'badge',
                  type: 'text',
                  label: 'Бейдж',
                  admin: { description: 'Например «Рекомендуем». Необязательный' },
                },
              ],
            },
            { name: 'whoFits', type: 'text', label: 'Кому подходит', required: true },
            // Метрик всегда две — места и базы. Фиксированные поля, а не массив:
            // та же причина, по которой колонки таблицы не массив
            {
              type: 'row',
              fields: [
                { name: 'seats', type: 'text', label: 'Мест', required: true },
                { name: 'seatsLabel', type: 'text', label: 'Подпись', required: true },
                { name: 'bases', type: 'text', label: 'Баз', required: true },
                { name: 'basesLabel', type: 'text', label: 'Подпись', required: true },
              ],
            },
            {
              name: 'items',
              type: 'array',
              label: 'Пункты',
              labels: { singular: 'Пункт', plural: 'Пункты' },
              fields: [
                {
                  name: 'kind',
                  type: 'select',
                  label: 'Тип строки',
                  required: true,
                  defaultValue: 'check',
                  options: [
                    { label: 'С галочкой', value: 'check' },
                    { label: 'Серая сноска', value: 'note' },
                  ],
                },
                { name: 'text', type: 'text', label: 'Текст', required: true },
                {
                  name: 'list',
                  type: 'array',
                  label: 'Вложенный список',
                  labels: { singular: 'Пункт', plural: 'Пункты' },
                  fields: [{ name: 'text', type: 'text', label: 'Пункт', required: true }],
                },
              ],
            },
          ],
        },

        // ---------- Ещё три тарифа ----------
        {
          name: 'extra',
          type: 'group',
          label: 'Раскрывашка «Ещё три тарифа»',
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок раскрывашки', required: true },
            {
              name: 'items',
              type: 'array',
              label: 'Тарифы',
              labels: { singular: 'Тариф', plural: 'Тарифы' },
              maxRows: 3,
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', type: 'text', label: 'Название', required: true },
                    { name: 'specs', type: 'text', label: 'Мест и баз', required: true },
                  ],
                },
                { name: 'text', type: 'textarea', label: 'Что входит', required: true },
                {
                  name: 'note',
                  type: 'text',
                  label: 'Курсивная подпись',
                  admin: { description: 'Кому нужен тариф. Выводится курсивом' },
                },
              ],
            },
            {
              name: 'banner',
              type: 'group',
              label: 'Плашка с кнопкой',
              fields: [
                { name: 'text', type: 'text', label: 'Текст', required: true },
                {
                  name: 'buttonLabel',
                  type: 'text',
                  label: 'Подпись кнопки',
                  defaultValue: 'Оставить заявку',
                  required: true,
                },
              ],
            },
          ],
        },

        // ---------- Одинаково во всех тарифах ----------
        {
          name: 'common',
          type: 'group',
          label: 'Блок «Одинаково во всех тарифах»',
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
            {
              name: 'items',
              type: 'array',
              label: 'Карточки',
              labels: { singular: 'Карточка', plural: 'Карточки' },
              maxRows: 4,
              admin: { description: 'Четыре в ряд. Пятая уедет на вторую строку и поломает ритм' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    iconField({ required: false }),
                    { name: 'title', type: 'text', label: 'Заголовок', required: true },
                  ],
                },
                { name: 'text', type: 'textarea', label: 'Текст', required: true },
              ],
            },
          ],
        },

        // ---------- Плашка смены тарифа ----------
        {
          name: 'switchNote',
          type: 'group',
          label: 'Плашка «Тариф можно поменять»',
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок', required: true },
            { name: 'text', type: 'textarea', label: 'Текст', required: true },
          ],
        },
      ],
    },
  ],
}