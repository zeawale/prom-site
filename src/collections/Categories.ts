import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    group: 'Каталог',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Название',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Слаг',
      admin: { description: 'Латиницей, через дефис: otchetnost-i-nalogi' },
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Иконка',
      admin: { description: 'Слаг иконки: report, signature, truck' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Порядок в сайдбаре',
      defaultValue: 0,
    },
  ],
}