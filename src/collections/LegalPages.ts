import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Три юридических документа: политика обработки ПДн, политика cookie,
 * согласие на обработку. Коллекция, а не три глобала: структура у них
 * одинаковая до последнего поля, различается только содержимое.
 *
 * Текст хранится секциями, а не одним richText. Причина та же, по которой
 * от Lexical отказались в карточках: структурированное поле даёт ровно то,
 * что нужно, и не позволяет вставить в юридический документ картинку или
 * заголовок не того уровня. Цена — документ от юриста придётся разложить
 * по полям руками, а не вставить целиком.
 */
export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Юридический документ', plural: 'Юридические документы' },
  admin: {
    group: 'Документы',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'effectiveDate'],
  },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ doc, previousDoc, req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath(`/${doc.slug}`)
        // Смена слага оставляет старый адрес в кеше. У остальных сущностей
        // это записано в техдолг, здесь закрыто: документов три, слаг —
        // select, и промахнуться дороже, чем в каталоге
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidatePath(`/${previousDoc.slug}`)
        }
      },
    ],
    afterDelete: [
      ({ doc, req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath(`/${doc.slug}`)
      },
    ],
  },

  fields: [
    {
      // select, а не text: маршрутов ровно три, они прописаны в коде.
      // Опечатка в слаге дала бы страницу, которую невозможно открыть
      name: 'slug',
      type: 'select',
      label: 'Адрес страницы',
      required: true,
      unique: true,
      index: true,
      options: [
        { label: '/privacy — политика обработки ПДн', value: 'privacy' },
        { label: '/cookie — политика использования cookie', value: 'cookie' },
        { label: '/consent — согласие на обработку ПДн', value: 'consent' },
      ],
    },
    { name: 'title', type: 'text', label: 'Заголовок H1', required: true },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Лид под заголовком',
      admin: { description: 'Необязательный' },
    },
    {
      name: 'effectiveDate',
      type: 'date',
      label: 'Дата редакции',
      required: true,
      admin: {
        description: 'Показывается на странице. Обязательный реквизит документа',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' },
      },
    },
    {
      // Версия нужна только согласию: она пишется в каждую заявку как
      // доказательство того, на какую редакцию человек соглашался.
      // Менять при КАЖДОЙ правке текста согласия, иначе доказательство
      // разъедется с документом
      name: 'version',
      type: 'text',
      label: 'Версия документа',
      admin: {
        condition: (_, sibling) => sibling?.slug === 'consent',
        description:
          'Пишется в каждую заявку. Менять при любой правке текста, иначе в базе останется ссылка на редакцию, которой человек не видел. Формат — дата: 2026-09-05',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Разделы',
      labels: { singular: 'Раздел', plural: 'Разделы' },
      required: true,
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Заголовок раздела',
          admin: {
            description:
              'Номер раздела пишется прямо в заголовке («1. Общие положения»). Автонумерации нет намеренно: на пункты юридического документа ссылаются по номерам, и сдвиг после удаления раздела ломал бы ссылки',
          },
        },
        {
          name: 'paragraphs',
          type: 'array',
          label: 'Абзацы',
          labels: { singular: 'Абзац', plural: 'Абзацы' },
          fields: [{ name: 'text', type: 'textarea', label: 'Текст', required: true }],
        },
        {
          name: 'listType',
          type: 'select',
          label: 'Тип списка',
          defaultValue: 'unordered',
          options: [
            { label: 'Маркированный', value: 'unordered' },
            { label: 'Нумерованный', value: 'ordered' },
          ],
          admin: {
            description: 'Нумерацию рисует браузер. Для сквозных пунктов вида «3.2» — абзацы',
          },
        },
        {
          name: 'list',
          type: 'array',
          label: 'Список',
          labels: { singular: 'Пункт', plural: 'Пункты' },
          fields: [{ name: 'text', type: 'textarea', label: 'Пункт', required: true }],
        },
      ],
    },
  ],
}
