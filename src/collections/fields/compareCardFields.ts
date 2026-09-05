import type { Field } from 'payload'

/**
 * Одна колонка блока «1С:Фреш или 1С:ГРМ».
 *
 * Фабрика, а не константа: Payload дописывает в объекты полей служебные
 * свойства, и один объект, переданный в обе колонки, получил бы общее
 * состояние. Та же причина, что у tariffRowFields.
 */
export const compareCardFields = (): Field[] => [
  { name: 'title', type: 'text', label: 'Название', required: true },
  {
    name: 'badge',
    type: 'text',
    label: 'Бейдж',
    admin: { description: 'Необязательный. Капс делает вёрстка — писать обычным регистром' },
  },
  { name: 'description', type: 'text', label: 'Подпись под названием', required: true },
  {
    name: 'rows',
    type: 'array',
    label: 'Параметры',
    labels: { singular: 'Параметр', plural: 'Параметры' },
    maxRows: 8,
    admin: {
      description:
        'Названия параметров должны совпадать в обеих колонках — иначе строки не встанут друг напротив друга',
    },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'label', type: 'text', label: 'Параметр', required: true },
          { name: 'value', type: 'text', label: 'Значение', required: true },
        ],
      },
    ],
  },
  {
    // В макете сноска есть только у колонки ГРМ («Перенос из ГРМ во Фреш
    // возможен только для типовой базы»), но поле общее: блок зеркальный,
    // и жёстко привязывать текст к одной колонке значит однажды не суметь
    // добавить его во вторую без правки кода.
    name: 'note',
    type: 'textarea',
    label: 'Сноска под параметрами',
    admin: { description: 'Необязательная. Мелкий серый текст в самом низу колонки' },
  },
  {
    name: 'href',
    type: 'text',
    label: 'Ссылка на страницу',
    required: true,
    admin: { description: 'Ссылка прячется на той странице, где эта колонка и так открыта' },
  },
]
