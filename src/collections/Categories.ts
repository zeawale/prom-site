import type { CollectionConfig } from 'payload'
import { iconField } from './fields/iconField'
import { revalidatePath } from 'next/cache'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    read: () => true,
  },
    hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/services', 'layout')
      },
    ],
    afterDelete: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/services', 'layout')
      },
    ],
  },
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
    iconField(),
    {
      name: 'order',
      type: 'number',
      label: 'Порядок в сайдбаре',
      defaultValue: 0,
    },
  ],
}