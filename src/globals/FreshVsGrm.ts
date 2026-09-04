import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { compareCardFields } from '../collections/fields/compareCardFields'

/**
 * Блок «1С:Фреш или 1С:ГРМ». Один контент на две страницы: на /fresh и на /grm
 * он одинаковый, отличается только тем, у какой колонки спрятана ссылка —
 * это решает страница пропом current, а не CMS.
 *
 * Отдельный глобал, а не поля внутри Fresh: у блока два равноправных
 * потребителя. История с tariffDisclaimer, который лежал в ProgramsSection и
 * не гасил /its, повторяться не должна.
 */
export const FreshVsGrm: GlobalConfig = {
  slug: 'fresh-vs-grm',
  label: 'Блок «1С:Фреш или 1С:ГРМ»',
  admin: { group: 'Продукты' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/fresh')
        revalidatePath('/grm')
      },
    ],
  },

  fields: [
    { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
    { name: 'lead', type: 'textarea', label: 'Подзаголовок', required: true },
    { name: 'fresh', type: 'group', label: 'Колонка «1С:Фреш»', fields: compareCardFields() },
    { name: 'grm', type: 'group', label: 'Колонка «1С:ГРМ»', fields: compareCardFields() },
  ],
}
