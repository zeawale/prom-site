import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/** Убирает из телефона всё, кроме плюса и цифр: для href="tel:" */
const toRaw = (value?: string | null) => (value ? value.replace(/[^\d+]/g, '') : value)

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Реквизиты и контакты',
  admin: { group: 'Настройки' },
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        // Контакты живут в шапке и футере, то есть в корневом лейауте.
        // Точечная ревалидация здесь невозможна: гасим весь сайт
        revalidatePath('/', 'layout')
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          label: 'Телефон',
          required: true,
          defaultValue: '+7 (831) 282-31-99',
          admin: { description: 'В том виде, в каком показывается на сайте' },
        },
        {
          name: 'phoneRaw',
          type: 'text',
          label: 'Телефон для ссылки',
          admin: {
            readOnly: true,
            description: 'Заполняется автоматически из поля слева',
          },
          hooks: {
            beforeValidate: [({ siblingData }) => toRaw(siblingData?.phone)],
          },
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      label: 'Почта',
      required: true,
      defaultValue: 'info@pm52.ru',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Адрес',
      required: true,
      defaultValue: 'Нижний Новгород, Казанское шоссе, д.12 к.1 оф.311',
    },
    {
      name: 'workHours',
      type: 'text',
      label: 'Часы работы',
      required: true,
      defaultValue: 'Пн–Пт 09:00–18:00',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'legalName',
          type: 'text',
          label: 'Юридическое лицо',
          required: true,
          defaultValue: 'ООО «НПП ПРО-М»',
        },
        {
          name: 'inn',
          type: 'text',
          label: 'ИНН',
          required: true,
          defaultValue: '5260165194',
        },
        {
          name: 'ogrn',
          type: 'text',
          label: 'ОГРН',
          admin: { description: 'Уточнить у Дмитрия' },
        },
      ],
    },
  ],
}
