import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Тексты cookie-баннера и модалки настроек. Сняты с макета.
 *
 * Одно осознанное отклонение от макета — описание функциональных cookie.
 * В макете было «Запоминают ваши настройки на сайте», но именно к этой
 * категории привязана загрузка виджета Яндекс.Карт на «Контактах».
 * Согласие «запоминать настройки», по которому вдобавок уходит запрос на
 * сторонний домен, — это согласие, полученное не на то, о чём спросили.
 * Поэтому карта названа прямо.
 *
 * Версия согласия — дата. Меняется при изменении состава категорий или
 * текста политики cookie: посетители, ответившие на прежних условиях,
 * увидят баннер снова.
 */
const seed = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'cookie-banner',
    data: {
      version: '2026-09-10',

      title: 'Мы используем cookie',
      text: 'Файлы cookie помогают сайту работать корректно и собирать обезличенную статистику посещений. Вы можете выбрать, какие из них использовать.',
      policyLabel: 'Политика использования cookie',

      acceptAllLabel: 'Принять все',
      necessaryOnlyLabel: 'Только необходимые',
      settingsLabel: 'Настроить',

      settings: {
        title: 'Настройки cookie',

        necessary: {
          label: 'Необходимые',
          text: 'Обеспечивают работу сайта и отправку форм. Отключить нельзя.',
        },
        analytics: {
          label: 'Аналитические',
          text: 'Яндекс.Метрика: обезличенная статистика посещений.',
        },
        functional: {
          label: 'Функциональные',
          text: 'Запоминают ваши настройки и разрешают встроенные виджеты — например карту проезда на странице «Контакты».',
        },

        saveLabel: 'Сохранить выбор',
        acceptAllLabel: 'Принять все',
      },
    },
  })

  console.log('Cookie-баннер записан.')
  console.log('Версия согласия: 2026-09-10. Меняется вместе с составом категорий.')
  process.exit(0)
}

process.on('unhandledRejection', (e) => {
  console.error('UNHANDLED REJECTION:', e)
  process.exit(1)
})

seed().catch((e) => {
  console.error('ОШИБКА В SEED:', e)
  process.exit(1)
})
