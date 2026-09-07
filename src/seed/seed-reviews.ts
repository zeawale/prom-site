import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Отзывы клиентов. Тексты сняты с макета главной.
 *
 * ВАЖНО: это рыба. Реальные отзывы — ФИО, должность, компания, текст —
 * ещё не получены от Дмитрия, и до публикации сайта они обязаны быть
 * заменены. Выдуманный отзыв от имени существующей компании — это не
 * «временная заглушка», а недостоверная реклама.
 *
 * Идемпотентен: находит отзыв по имени автора и обновляет, а не плодит
 * дубли при повторном запуске.
 */
const REVIEWS = [
  {
    author: 'Ирина Кузнецова',
    role: 'ИП, магазин на маркетплейсах',
    text: 'Веду учёт сама, вечерами из дома. После переноса в 1С:Фреш не нужно ждать, пока кто-то включит компьютер в офисе — захожу с ноутбука в любое время.',
    order: 1,
  },
  {
    author: 'Ольга Демидова',
    role: 'руководитель, бухгалтерская компания «Актив Учёт»',
    text: 'У нас 40 клиентов. Все базы в одном месте, отчётность сдаём по всем юрлицам из одной программы. Обновления ставит ПРО-М, мы этим не занимаемся.',
    order: 2,
  },
  {
    author: 'Сергей Гаврилов',
    role: 'директор, оптовая компания «Волга Опт»',
    text: 'Нашу доработанную «Управление торговлей» перевели в 1С:ГРМ за один день. Свои отчёты, которые нам когда-то писали, продолжают работать.',
    order: 3,
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  for (const review of REVIEWS) {
    const { docs } = await payload.find({
      collection: 'reviews',
      where: { author: { equals: review.author } },
      limit: 1,
    })

    const data = { ...review, showOnHome: true }

    if (docs[0]) {
      await payload.update({
        context: { disableRevalidate: true },
        collection: 'reviews',
        id: docs[0].id,
        data,
      })
    } else {
      await payload.create({
        context: { disableRevalidate: true },
        collection: 'reviews',
        data,
      })
    }
  }

  console.log(`Отзывы: записано ${REVIEWS.length}. ВНИМАНИЕ: это рыба, заменить до публикации`)
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
