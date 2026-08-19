import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'isPopular', 'isNew'],
    group: 'Каталог',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Название' },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Слаг',
    },
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Заголовок-выгода',
      admin: { description: 'Крупный текст в карточке. Тире — длинное «—»' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Описание',
      admin: { description: '30–35 слов' },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: false,
      required: true,
      label: 'Категория',
    },
    { name: 'icon', type: 'text', label: 'Иконка' },
    {
      type: 'row',
      fields: [
        { name: 'isPopular', type: 'checkbox', label: 'Популярное', defaultValue: false },
        { name: 'isNew', type: 'checkbox', label: 'Новинка', defaultValue: false },
      ],
    },
    {
      name: 'related',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      maxRows: 3,
      label: 'Часто берут вместе',
    },
    {
      name: 'popup',
      type: 'group',
      label: 'Попап',
      fields: [
        {
          name: 'whoNeedsIt',
          type: 'array',
          label: 'Кому нужен',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'howItWorks',
          type: 'array',
          label: 'Как это работает',
          admin: { description: 'Пусто — блок не рендерится. Шаги не выдумывать' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
        {
          name: 'requirements',
          type: 'array',
          label: 'Что нужно для подключения',
          fields: [{ name: 'text', type: 'text', required: true }],
        },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Текст кнопки',
          defaultValue: 'Подключить сервис',
        },
      ],
    },
    {
      name: 'sourceUrls',
      type: 'array',
      label: 'Источники',
      fields: [{ name: 'url', type: 'text', required: true }],
    },
  ],
}