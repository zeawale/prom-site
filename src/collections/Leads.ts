import type { CollectionConfig } from 'payload'
import { notifyNewLead } from '@/lib/leadEmail'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  hooks: {
    afterChange: [notifyNewLead],
  },
  access: {
    // Форма создаёт заявку через Local API на сервере, ему access не
    // нужен. Открытый create пускал бы в /api/leads мимо проверки полей и
    // согласия, а каждая такая заявка — ещё и письмо в рабочий ящик
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'status', 'createdAt'],
    group: 'Заявки',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Имя',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Телефон',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'E-mail',
    },
    {
      name: 'comment',
      type: 'textarea',
      label: 'Комментарий',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      label: 'Статус',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'in_progress' },
        { label: 'Закрыта', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'page',
      type: 'text',
      label: 'Источник',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Откуда отправлена заявка',
      },
    },
    {
      type: 'collapsible',
      label: 'Согласие на обработку данных',
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'consentAt',
          type: 'date',
          label: 'Дата и время согласия',
          admin: {
            readOnly: true,
            date: { pickerAppearance: 'dayAndTime' },
          },
        },
        {
          name: 'consentIp',
          type: 'text',
          label: 'IP-адрес',
          admin: { readOnly: true },
        },
        {
          name: 'consentVersion',
          type: 'text',
          label: 'Редакция документа',
          admin: { readOnly: true },
        },
      ],
    },
  ],
}
