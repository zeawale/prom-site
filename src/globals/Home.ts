import type { GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'
import { iconField } from '../collections/fields/iconField'

/**
 * Главная страница целиком.
 *
 * Глобал, как /its, /fresh и /grm: страница одна, структура блоков
 * известна заранее и меняться без разработчика не будет.
 *
 * Чего здесь намеренно нет:
 *   • отзывов — они в коллекции Reviews, те же карточки идут на «О компании»;
 *   • карточек блока «Сервисы 1С» — это живые записи каталога с флагом
 *     «Популярное», страница берёт их из базы. Продублировать три сервиса
 *     руками значило бы получить на главной описание, разошедшееся с
 *     карточкой в каталоге;
 *   • телефона в нижней плашке — он один на весь сайт и живёт в Settings.
 */
export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Главная страница',
  admin: { group: 'Страницы' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        revalidatePath('/')
      },
    ],
  },

  fields: [
    // ---------- Первый экран ----------
    {
      name: 'hero',
      type: 'group',
      label: 'Первый экран',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок H1', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок', required: true },
        {
          name: 'ctaText',
          type: 'text',
          label: 'Текст оранжевой кнопки',
          defaultValue: 'Получить консультацию',
        },
      ],
    },

    // ---------- Где вы сейчас ----------
    {
      name: 'states',
      type: 'group',
      label: 'Где вы сейчас',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок' },

        /* Подписи управления вынесены на уровень секции, а не в карточку:
           они одинаковы у всех четырёх, и четыре копии одного слова в
           админке — это четыре возможности их рассинхронизировать */
        {
          type: 'row',
          fields: [
            {
              name: 'openLabel',
              type: 'text',
              label: 'Ссылка «раскрыть»',
              defaultValue: 'Это про меня',
            },
            {
              name: 'closeLabel',
              type: 'text',
              label: 'Ссылка «свернуть»',
              defaultValue: 'Свернуть',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'criteriaTitle',
              type: 'text',
              label: 'Подпись над списком признаков',
              defaultValue: 'Это про вас, если',
            },
            {
              name: 'solutionLabel',
              type: 'text',
              label: 'Кнопка в карточке решения',
              defaultValue: 'Перейти',
            },
          ],
        },

        {
          name: 'items',
          type: 'array',
          label: 'Состояния',
          labels: { singular: 'Состояние', plural: 'Состояния' },
          /* Ровно четыре: номера 01–04 рисуются индексом, а раскладка
             в две колонки рассчитана на чётное число */
          minRows: 4,
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок состояния', required: true },
            {
              name: 'description',
              type: 'textarea',
              label: 'Описание в свёрнутой карточке',
              required: true,
              admin: { description: 'Одна строка — в свёрнутом виде места больше нет' },
            },
            {
              name: 'criteria',
              type: 'array',
              label: 'Признаки',
              labels: { singular: 'Признак', plural: 'Признаки' },
              minRows: 1,
              maxRows: 4,
              fields: [{ name: 'text', type: 'textarea', label: 'Признак', required: true }],
            },
            {
              name: 'solutions',
              type: 'array',
              label: 'Что предлагаем',
              labels: { singular: 'Решение', plural: 'Решения' },
              minRows: 1,
              maxRows: 2,
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  label: 'Надпись над названием',
                  required: true,
                  admin: {
                    description:
                      'Условие выбора: «База без доработок», «Своего специалиста нет». Капс делает вёрстка',
                  },
                },
                { name: 'title', type: 'text', label: 'Название продукта', required: true },
                { name: 'text', type: 'textarea', label: 'Описание', required: true },
                {
                  name: 'href',
                  type: 'text',
                  label: 'Адрес страницы',
                  required: true,
                  admin: { description: 'Внутренний путь: /fresh, /programs, /services' },
                },
              ],
            },
          ],
        },

        {
          name: 'footer',
          type: 'group',
          label: 'Плашка под карточками',
          fields: [
            { name: 'text', type: 'text', label: 'Текст', required: true },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Кнопка',
              defaultValue: 'Заказать звонок',
            },
          ],
        },
      ],
    },

    // ---------- Направления работы ----------
    {
      name: 'directions',
      type: 'group',
      label: 'Направления работы',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        {
          name: 'items',
          type: 'array',
          label: 'Направления',
          labels: { singular: 'Направление', plural: 'Направления' },
          minRows: 3,
          maxRows: 3,
          fields: [
            iconField({ required: false }),
            { name: 'title', type: 'text', label: 'Название', required: true },
            {
              name: 'lead',
              type: 'textarea',
              label: 'Кому подходит',
              required: true,
              admin: { description: 'Оранжевая строка под названием' },
            },
            {
              name: 'list',
              type: 'array',
              label: 'Пункты',
              labels: { singular: 'Пункт', plural: 'Пункты' },
              minRows: 1,
              maxRows: 4,
              fields: [{ name: 'text', type: 'textarea', label: 'Пункт', required: true }],
            },
            { name: 'href', type: 'text', label: 'Адрес страницы', required: true },
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Кнопка',
              defaultValue: 'Подробнее',
            },
          ],
        },
      ],
    },

    // ---------- Сервисы 1С ----------
    {
      name: 'servicesPreview',
      type: 'group',
      label: 'Сервисы 1С',
      admin: {
        description:
          'Карточки берутся из каталога — сервисы с флагом «Популярное». Здесь только обрамление блока',
      },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Кнопка в карточке',
          defaultValue: 'Подробнее',
        },
        {
          name: 'allLabel',
          type: 'text',
          label: 'Подпись у стрелки на каталог',
          defaultValue: 'Все сервисы',
          admin: { description: 'Видна скринридеру, глазами — только стрелка' },
        },
      ],
    },

    // ---------- С кем вы будете работать ----------
    {
      name: 'company',
      type: 'group',
      label: 'С кем вы будете работать',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок' },
        {
          type: 'row',
          fields: [
            {
              name: 'buttonLabel',
              type: 'text',
              label: 'Кнопка',
              defaultValue: 'Подробнее о компании',
            },
            { name: 'buttonHref', type: 'text', label: 'Адрес', defaultValue: '/about' },
          ],
        },
        {
          name: 'counters',
          type: 'array',
          label: 'Счётчики',
          labels: { singular: 'Счётчик', plural: 'Счётчики' },
          minRows: 3,
          maxRows: 3,
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', label: 'Число', required: true },
                { name: 'caption', type: 'text', label: 'Расшифровка', required: true },
              ],
            },
          ],
        },
      ],
    },

    // ---------- Что мы делаем после оплаты ----------
    {
      name: 'afterPayment',
      type: 'group',
      label: 'Что мы делаем после оплаты',
      admin: { description: 'Выводится тем же компонентом, что и пункты 01–06 на /its' },
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        { name: 'lead', type: 'textarea', label: 'Подзаголовок' },
        {
          name: 'items',
          type: 'array',
          label: 'Шаги',
          labels: { singular: 'Шаг', plural: 'Шаги' },
          minRows: 1,
          maxRows: 8,
          admin: { description: 'Номера рисуются порядком, отдельного поля у шага нет' },
          fields: [
            { name: 'title', type: 'text', label: 'Заголовок шага', required: true },
            { name: 'text', type: 'textarea', label: 'Описание', required: true },
          ],
        },
      ],
    },

    // ---------- FAQ ----------
    {
      name: 'faq',
      type: 'group',
      label: 'Часто задаваемые вопросы',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок блока', required: true },
        {
          name: 'items',
          type: 'array',
          label: 'Вопросы',
          labels: { singular: 'Вопрос', plural: 'Вопросы' },
          minRows: 1,
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
    },
  ],
}
