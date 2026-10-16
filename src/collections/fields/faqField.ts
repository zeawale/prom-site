import type { Field } from 'payload'

type FaqFieldOptions = {
  /**
   * На главной блок обязателен: он есть в макете, без вопросов страница
   * обрывается. На продуктовых страницах блок необязательный — нет вопросов,
   * нет и блока, а глобал сохраняется без них.
   */
  required?: boolean
}

/**
 * Блок «Вопросы и ответы»: заголовок и список вопросов для аккордеона Faq.
 *
 * Функция, а не константа, по той же причине, что tariffRowFields: Payload
 * дописывает в объекты полей служебные свойства, и общий объект на пять
 * мест получил бы общее состояние.
 */
export const faqField = ({ required = false }: FaqFieldOptions = {}): Field => ({
  name: 'faq',
  type: 'group',
  label: required ? 'Часто задаваемые вопросы' : 'Вопросы и ответы',
  admin: required ? undefined : { description: 'Без вопросов блок на странице не показывается' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Заголовок блока',
      required,
      defaultValue: required ? undefined : 'Вопросы и ответы',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Вопросы',
      labels: { singular: 'Вопрос', plural: 'Вопросы' },
      minRows: required ? 1 : undefined,
      fields: [
        { name: 'question', type: 'text', label: 'Вопрос', required: true },
        {
          name: 'answer',
          type: 'textarea',
          label: 'Ответ',
          required: true,
          admin: { description: 'Абзацы разделяются переводом строки' },
        },
      ],
    },
  ],
})
