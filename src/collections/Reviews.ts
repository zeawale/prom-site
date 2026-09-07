import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Отзывы клиентов.
 *
 * Коллекция, а не поля внутри глобала главной: те же отзывы идут на
 * «О компании», и дублировать текст в двух местах значит однажды
 * получить две разошедшиеся версии одной цитаты. Флаг showOnHome
 * решает, кто попадает на главную, порядок задаётся полем order.
 *
 * Фото нет намеренно: в макете карточка отзыва без аватара. Появятся
 * реальные фотографии — добавится upload-поле, а не переделается блок.
 */
export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Отзыв', plural: 'Отзывы' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
      },
    ],
  },

  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'role', 'showOnHome', 'order'],
    group: 'Контент',
  },

  fields: [
    {
      name: 'author',
      type: 'text',
      label: 'Имя и фамилия',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Должность и компания',
      required: true,
      admin: { description: 'Например: руководитель, бухгалтерская компания «Актив Учёт»' },
    },
    {
      name: 'text',
      type: 'textarea',
      label: 'Текст отзыва',
      required: true,
      admin: { description: 'Кавычки-ёлочки ставит вёрстка — в поле их писать не нужно' },
    },
    {
      name: 'showOnHome',
      type: 'checkbox',
      label: 'Показывать на главной',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'На главной выводятся три первых по порядку',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
