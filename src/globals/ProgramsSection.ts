import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Всё, что одинаково на семи страницах программ.
 * Живёт в глобале, а не в каждой программе — иначе Дмитрий правит
 * один и тот же лид семь раз, и на седьмой раз тексты разъезжаются.
 */
export const ProgramsSection: GlobalConfig = {
  slug: 'programs-section',
  label: 'Раздел «Программы 1С»',
  admin: { group: 'Продукты' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/programs/[slug]', 'page')
        revalidatePath('/programs', 'layout')
      },
    ],
  },

  fields: [
    { name: 'title', type: 'text', label: 'Заголовок раздела', required: true },
    { name: 'lead', type: 'textarea', label: 'Лид раздела', required: true },
    {
      name: 'cloudBanner',
      type: 'group',
      label: 'Баннер «Работать через браузер»',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true },
        { name: 'text', type: 'textarea', label: 'Текст', required: true },
        {
          name: 'buttons',
          type: 'array',
          label: 'Кнопки',
          labels: { singular: 'Кнопка', plural: 'Кнопки' },
          maxRows: 2,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', type: 'text', label: 'Подпись', required: true },
                { name: 'href', type: 'text', label: 'Ссылка', required: true },
                {
                  name: 'style',
                  type: 'select',
                  label: 'Вид',
                  defaultValue: 'primary',
                  options: [
                    { value: 'primary', label: 'Синяя' },
                    { value: 'accent', label: 'Оранжевая' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
