import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Страница /about целиком.
 *
 * Глобал, а не строка коллекции — по той же причине, что у Fresh, GRM и
 * главной: страница одна, с собственным адресом, собственной ревалидацией
 * и собственным набором полей.
 *
 * Отзывов здесь нет: они живут в коллекции Reviews и выводятся на обеих
 * страницах. Здесь только заголовок блока — сами карточки страница берёт
 * запросом.
 */
export const About: GlobalConfig = {
  slug: 'about',
  label: 'Страница «О компании»',
  admin: { group: 'Контент' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/about')
      },
    ],
  },

  fields: [
    { name: 'title', type: 'text', label: 'Заголовок H1', required: true },

    {
      name: 'body',
      type: 'textarea',
      label: 'Текст о компании',
      required: true,
      admin: { description: 'Абзацы разделяются переводом строки' },
    },

    {
      // Необязательное: фотографии директора пока нет, и требовать её
      // значило бы не дать сохранить страницу. Пока пусто — на месте
      // фото стоит нейтральная заглушка, вёрстка не разъезжается
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      label: 'Фото справа',
      admin: { description: 'Необязательно. Пока не загружено — на месте фото серая плашка' },
    },

    {
      name: 'counters',
      type: 'array',
      label: 'Счётчики',
      labels: { singular: 'Счётчик', plural: 'Счётчики' },
      maxRows: 4,
      admin: { description: 'Четыре в макете. Порядок — как в списке' },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Число',
              required: true,
              admin: { description: 'Например: 20+, 2014, 1200+' },
            },
            { name: 'caption', type: 'text', label: 'Подпись', required: true },
          ],
        },
      ],
    },

    {
      name: 'reviewsTitle',
      type: 'text',
      label: 'Заголовок блока отзывов',
      defaultValue: 'Отзывы клиентов',
      admin: { description: 'Без двоеточия в конце' },
    },
    {
      name: 'reviewsLead',
      type: 'textarea',
      label: 'Абзац под заголовком отзывов',
      admin: {
        description:
          'Сами отзывы правятся в разделе «Отзывы». Здесь только текст над ними. На эту страницу идут все отзывы, на главную — три с галочкой «Показывать на главной»',
      },
    },
  ],
}
