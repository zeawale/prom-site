import type { Field, GlobalConfig } from 'payload'
import { revalidatePath } from 'next/cache'

/**
 * Тексты cookie-баннера и модалки настроек.
 *
 * Отдельный глобал, а не поля в Settings: это связный кусок контента
 * страницы, а Settings — реквизиты компании. Плюс своя ревалидация:
 * баннер живёт в корневом layout, значит гасить надо весь сайт.
 *
 * Юридическая часть, которая НЕ настраивается из админки и жёстко зашита
 * в компонент: кнопка отказа равна по размеру и весу кнопке принятия, а
 * все категории кроме необходимых выключены по умолчанию. Это требования,
 * а не оформление, и давать их править — значит однажды получить баннер
 * с преднажатыми галочками.
 */

/** Три категории устроены одинаково, поля собираются фабрикой */
const category = (
  name: string,
  label: string,
  defaultLabel: string,
  defaultText: string,
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Название категории',
          required: true,
          defaultValue: defaultLabel,
        },
        {
          name: 'text',
          type: 'textarea',
          label: 'Описание',
          required: true,
          defaultValue: defaultText,
        },
      ],
    },
  ],
})

export const CookieBanner: GlobalConfig = {
  slug: 'cookie-banner',
  label: 'Cookie-баннер',
  admin: { group: 'Контент' },
  access: { read: () => true },

  hooks: {
    afterChange: [
      ({ req }) => {
        if (req?.context?.disableRevalidate) return
        // Баннер в корневом layout — гасим весь сайт целиком
        revalidatePath('/', 'layout')
      },
    ],
  },

  fields: [
    {
      name: 'version',
      type: 'text',
      label: 'Версия согласия',
      required: true,
      defaultValue: '2026-09-10',
      admin: {
        description:
          'Меняйте дату, когда меняется состав категорий или текст политики cookie. Посетители, согласившиеся со старой версией, увидят баннер снова — согласие на прежних условиях к новым не относится',
      },
    },

    { name: 'title', type: 'text', label: 'Заголовок плашки', required: true },
    { name: 'text', type: 'textarea', label: 'Текст плашки', required: true },
    {
      name: 'policyLabel',
      type: 'text',
      label: 'Подпись ссылки на политику',
      required: true,
      defaultValue: 'Политика использования cookie',
      admin: { description: 'Ведёт на страницу /cookie, адрес менять не нужно' },
    },

    {
      type: 'row',
      fields: [
        {
          name: 'acceptAllLabel',
          type: 'text',
          label: 'Кнопка «принять всё»',
          required: true,
          defaultValue: 'Принять все',
        },
        {
          name: 'necessaryOnlyLabel',
          type: 'text',
          label: 'Кнопка отказа',
          required: true,
          defaultValue: 'Только необходимые',
          admin: {
            description:
              'Выводится тем же размером и весом, что и кнопка принятия — это требование, а не оформление',
          },
        },
        {
          name: 'settingsLabel',
          type: 'text',
          label: 'Кнопка настроек',
          required: true,
          defaultValue: 'Настроить',
        },
      ],
    },

    {
      name: 'settings',
      type: 'group',
      label: 'Модалка настроек',
      fields: [
        { name: 'title', type: 'text', label: 'Заголовок', required: true, defaultValue: 'Настройки cookie' },

        category(
          'necessary',
          'Категория «Необходимые»',
          'Необходимые',
          'Обеспечивают работу сайта и отправку форм. Отключить нельзя.',
        ),
        category(
          'analytics',
          'Категория «Аналитические»',
          'Аналитические',
          'Яндекс.Метрика: обезличенная статистика посещений.',
        ),
        category(
          'functional',
          'Категория «Функциональные»',
          'Функциональные',
          'Запоминают ваши настройки и разрешают встроенные виджеты — например карту проезда на странице «Контакты».',
        ),

        {
          type: 'row',
          fields: [
            {
              name: 'saveLabel',
              type: 'text',
              label: 'Кнопка сохранения',
              required: true,
              defaultValue: 'Сохранить выбор',
            },
            {
              name: 'acceptAllLabel',
              type: 'text',
              label: 'Кнопка «принять всё»',
              required: true,
              defaultValue: 'Принять все',
            },
          ],
        },
      ],
    },
  ],
}
