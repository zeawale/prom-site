import type { Field } from 'payload'

/**
 * Значение ячейки — select, а не свободный текст с правилом «печатай + или −».
 * Та же логика, по которой icon перевели из text в select: опечатка
 * не должна быть возможна.
 */
export const cellOptions = [
  { value: 'yes', label: 'Есть' },
  { value: 'no', label: 'Нет' },
  { value: 'text', label: 'Текст' },
]

type TariffRowOptions = {
  /**
   * Строка таблицы становится ссылкой на карточку каталога и открывает попап.
   * Нужно только на /its: там первая колонка — перечень сервисов ИТС.
   * У программ 1С в первой колонке возможности, ссылаться не на что.
   */
  withServiceLink?: boolean
}

/**
 * Поля одной строки тарифной таблицы.
 * Функция, а не константа: Payload при разборе конфига дописывает в объекты
 * полей служебные свойства. Один объект, переданный и в rows, и в detailsRows,
 * получил бы общее состояние.
 */
export const tariffRowFields = ({ withServiceLink = false }: TariffRowOptions = {}): Field[] => [
  {
    name: 'label',
    type: 'textarea',
    label: 'Строка',
    required: true,
  },
  ...(withServiceLink
    ? ([
        {
          name: 'service',
          type: 'relationship',
          relationTo: 'services',
          hasMany: false,
          label: 'Сервис каталога',
          admin: {
            description:
              'Если выбран — строка становится ссылкой и открывает попап сервиса. Пусто — обычный текст',
          },
        },
      ] as Field[])
    : []),
  {
    // type: 'row' — иначе одна строка растягивается на пол-экрана админки
    type: 'row',
    fields: [
      {
        name: 'col1',
        type: 'select',
        label: 'Колонка 1',
        options: cellOptions,
        defaultValue: 'no',
      },
      {
        name: 'col2',
        type: 'select',
        label: 'Колонка 2',
        options: cellOptions,
        defaultValue: 'no',
      },
      {
        name: 'col3',
        type: 'select',
        label: 'Колонка 3',
        options: cellOptions,
        defaultValue: 'no',
      },
    ],
  },
  {
    type: 'row',
    fields: [
      {
        name: 'col1Text',
        type: 'text',
        label: 'Текст колонки 1',
        admin: { condition: (_, sibling) => sibling?.col1 === 'text' },
      },
      {
        name: 'col2Text',
        type: 'text',
        label: 'Текст колонки 2',
        admin: { condition: (_, sibling) => sibling?.col2 === 'text' },
      },
      {
        name: 'col3Text',
        type: 'text',
        label: 'Текст колонки 3',
        admin: { condition: (_, sibling) => sibling?.col3 === 'text' },
      },
    ],
  },
]
