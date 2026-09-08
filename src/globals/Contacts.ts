import type { GlobalConfig } from 'payload'
import type { Field } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Страница /contacts целиком.
 *
 * Ключевое решение: сами реквизиты здесь НЕ хранятся. Телефон, почта,
 * часы, адрес, юрлицо и ИНН живут в глобале Settings — оттуда же их берут
 * шапка и футер. Продублировать их сюда значило бы однажды получить два
 * разных телефона на одном сайте: правку внесут в одном месте.
 *
 * Поэтому в этом глобале только то, чего в Settings нет и быть не должно, —
 * заголовок карточки и поясняющая подпись под значением («Разберём вашу
 * ситуацию сразу»). Значение приходит из Settings, обёртка — отсюда.
 */

/** Шесть карточек устроены одинаково, поэтому поля собираются фабрикой */
const card = (name: string, label: string, defaultLabel: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Заголовок карточки',
          required: true,
          defaultValue: defaultLabel,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Подпись под значением',
          admin: { description: 'Необязательно. Само значение берётся из «Реквизиты и контакты»' },
        },
      ],
    },
  ],
})

export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: 'Страница «Контакты»',
  admin: { group: 'Контент' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/contacts')
      },
    ],
  },

  fields: [
    { name: 'title', type: 'text', label: 'Заголовок H1', required: true },
    { name: 'lead', type: 'textarea', label: 'Лид под заголовком', required: true },

    card('phone', 'Карточка «Телефон»', 'Телефон'),
    card('email', 'Карточка «Почта»', 'Почта'),
    card('hours', 'Карточка «Часы работы»', 'Часы работы'),
    card('address', 'Карточка «Адрес офиса»', 'Адрес офиса'),
    card('legal', 'Карточка «Юридическое лицо»', 'Юридическое лицо'),
    card('inn', 'Карточка «ИНН»', 'ИНН'),

    {
      name: 'map',
      type: 'group',
      label: 'Карта',
      fields: [
        {
          name: 'url',
          type: 'text',
          label: 'Ссылка на виджет Яндекс.Карт',
          required: true,
          defaultValue:
            'https://yandex.ru/map-widget/v1/?text=%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9%20%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%2C%20%D0%9A%D0%B0%D0%B7%D0%B0%D0%BD%D1%81%D0%BA%D0%BE%D0%B5%20%D1%88%D0%BE%D1%81%D1%81%D0%B5%2C%2012%20%D0%BA.1&z=17&lang=ru_RU',
          admin: {
            description:
              'Адрес виджета из конструктора Яндекс.Карт. Значение по умолчанию ищет офис по адресу; если метка встала неточно, соберите карту в конструкторе и вставьте её ссылку сюда. Параметр lang=ru_RU обязателен: подписи на карте должны быть на русском.',
          },
        },
        {
          name: 'plaque',
          type: 'text',
          label: 'Плашка на карте',
          admin: { description: 'Тёмная подпись в углу карты' },
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Кнопка загрузки карты',
          defaultValue: 'Показать карту',
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Текст на заглушке',
          defaultValue:
            'Карта загружается с серверов Яндекса и ставит свои cookie. Нажмите, чтобы открыть её.',
          admin: {
            description:
              'Показывается до нажатия на кнопку. Пока карта не загружена, к Яндексу не уходит ни одного запроса',
          },
        },
      ],
    },
  ],
}
