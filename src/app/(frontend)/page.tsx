import type { Metadata } from 'next'
import { getHome, getHomeReviews, getPopularServices, getSettings } from '@/lib/queries'
import HomeHero from '@/components/home/HomeHero'
import StateCards, { type StateItem } from '@/components/home/StateCards'
import BlueBand from '@/components/home/BlueBand'
import Directions, { type Direction } from '@/components/home/Directions'
import ServicesPreview from '@/components/home/ServicesPreview'
import CompanyBlock from '@/components/home/CompanyBlock'
import NumberedList from '@/components/product/NumberedList'
import Faq from '@/components/product/Faq'

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome()
  return {
    title: 'Сервисы и программы 1С для малого бизнеса в Нижнем Новгороде | ПРО-М',
    description: home.hero?.lead ?? undefined,
  }
}

export default async function HomePage() {
  const [home, settings, reviews, services] = await Promise.all([
    getHome(),
    getSettings(),
    getHomeReviews(),
    getPopularServices(),
  ])

  const states = home.states

  /* Payload отдаёт массивы объектов ({ text }) и допускает null почти
     везде — компоненты про это знать не должны, разворачиваем здесь */
  const stateItems: StateItem[] = (states?.items ?? []).map((item) => ({
    title: item.title,
    description: item.description,
    criteria: (item.criteria ?? []).map((c) => c.text),
    solutions: (item.solutions ?? []).map((s) => ({
      eyebrow: s.eyebrow,
      title: s.title,
      text: s.text,
      href: s.href,
    })),
  }))

  const directions: Direction[] = (home.directions?.items ?? []).map((item) => ({
    icon: item.icon,
    title: item.title,
    lead: item.lead,
    list: (item.list ?? []).map((l) => l.text),
    href: item.href,
    buttonLabel: item.buttonLabel,
  }))

  return (
    <main className="container">
      <HomeHero
        title={home.hero?.title ?? ''}
        lead={home.hero?.lead ?? ''}
        ctaText={home.hero?.ctaText}
      />

      <StateCards
        title={states?.title ?? ''}
        lead={states?.lead}
        criteriaTitle={states?.criteriaTitle ?? 'Это про вас, если'}
        solutionLabel={states?.solutionLabel ?? 'Перейти'}
        items={stateItems}
        footerText={states?.footer?.text ?? ''}
        footerButton={states?.footer?.buttonLabel ?? 'Заказать звонок'}
        phone={settings.phone}
        phoneRaw={settings.phoneRaw ?? settings.phone}
      />

      {/* Два блока на общем синем фоне — так в макете */}
      <BlueBand>
        <Directions title={home.directions?.title ?? ''} items={directions} />
        <ServicesPreview
          title={home.servicesPreview?.title ?? ''}
          buttonLabel={home.servicesPreview?.buttonLabel}
          allLabel={home.servicesPreview?.allLabel}
          services={services}
        />
      </BlueBand>

      <CompanyBlock
        title={home.company?.title ?? ''}
        lead={home.company?.lead}
        buttonLabel={home.company?.buttonLabel}
        buttonHref={home.company?.buttonHref}
        counters={(home.company?.counters ?? []).map((c) => ({
          value: c.value,
          caption: c.caption,
        }))}
        reviews={reviews.map((r) => ({
          id: r.id,
          author: r.author,
          role: r.role,
          text: r.text,
        }))}
      />

      {/* Тот же компонент, что пункты 01–06 на /its — переиспользуется,
          а не переписывается вторым разом */}
      <NumberedList
        id="home"
        title={home.afterPayment?.title ?? ''}
        lead={home.afterPayment?.lead}
        items={(home.afterPayment?.items ?? []).map((item) => ({
          title: item.title,
          text: item.text,
        }))}
      />

      <Faq
        id="home"
        title={home.faq?.title ?? ''}
        items={(home.faq?.items ?? []).map((item) => ({
          question: item.question,
          answer: item.answer,
        }))}
      />
    </main>
  )
}
