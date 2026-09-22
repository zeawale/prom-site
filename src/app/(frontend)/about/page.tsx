import type { Metadata } from 'next'
import { getAbout, getAllReviews, getSettings } from '@/lib/queries'
import AboutIntro from '@/components/about/AboutIntro'
import ReviewGrid from '@/components/about/ReviewGrid'
import Counters from '@/components/product/Counters'

// Своего layout нет, как у /its, /fresh и /grm — <main> и .container
// рендерит сама страница

export async function generateMetadata(): Promise<Metadata> {
  const about = await getAbout()
  // Заполненность глобала гарантирует getAbout — см. assertFilled в
  // lib/queries. Страница обязательные поля больше не подстраховывает
  const first = about.body
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean)

  return {
    title: about.title ?? 'О компании',
    description: first,
  }
}

export default async function AboutPage() {
  const [about, reviews, settings] = await Promise.all([getAbout(), getAllReviews(), getSettings()])

  /* depth: 1 отдаёт фото документом, но тип поля допускает и число —
     когда картинку удалили из Media, а ссылка осталась. Разворачиваем
     аккуратно: компонент ждёт либо готовый объект, либо null */
  const photo =
    about.photo && typeof about.photo === 'object' && about.photo.url
      ? {
          url: about.photo.url,
          alt: about.photo.alt ?? '',
          width: about.photo.width ?? 800,
          height: about.photo.height ?? 600,
        }
      : null

  return (
    <main className="container">
      <AboutIntro title={about.title} body={about.body} photo={photo} />

      {/* Та же плашка, что на главной: цифры общие, из Settings */}
      <Counters
        columns={3}
        items={(settings.counters ?? []).map((counter) => ({
          value: counter.value,
          caption: counter.caption,
        }))}
      />

      {/* Сюда идут все отзывы, на главную — три с флагом showOnHome */}
      <ReviewGrid
        title={about.reviewsTitle ?? 'Отзывы клиентов'}
        lead={about.reviewsLead}
        reviews={reviews.map((review) => ({
          id: review.id,
          author: review.author,
          role: review.role,
          text: review.text,
        }))}
      />
    </main>
  )
}
