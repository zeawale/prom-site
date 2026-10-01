import type { ReactNode } from 'react'
import type { Service } from '@/payload-types'
import { visibleRelated } from '@/lib/services'
import { Icon } from '@/components/ui/Icon'
import { RequestButton } from '@/components/layout/RequestButton'
import styles from './ServiceDetail.module.css'

type Props = {
  service: Service
  /** Источник заявки: 'service' для попапа, 'service-page' для страницы */
  source: string
  /** Как рендерить связанные сервисы: ссылками или кнопками попапа */
  renderRelated: (related: Service[]) => ReactNode
  /**
   * Уровень заголовка с названием сервиса: 1 на отдельной странице, 2 в
   * попапе. Попап открывается поверх каталога или главной, где свой <h1>
   * уже есть, и второй на странице быть не должен. Заголовки разделов и
   * шагов считаются от него, чтобы иерархия не рвалась
   */
  headingLevel: 1 | 2
}

export function ServiceBody({ service, source, renderRelated, headingLevel }: Props) {
  const Title = `h${headingLevel}` as 'h1' | 'h2'
  const SectionTitle = `h${headingLevel + 1}` as 'h2' | 'h3'
  const StepTitle = `h${headingLevel + 2}` as 'h3' | 'h4'

  const related = visibleRelated(service.related)
  const steps = service.popup?.howItWorks ?? []
  const whoNeedsIt = service.popup?.whoNeedsIt ?? []
  const requirements = service.popup?.requirements ?? []

  const categoryTitle =
    typeof service.category === 'object' && service.category !== null
      ? service.category.title
      : null

  return (
    <article className={styles.detail}>
      <header className={styles.head}>
        <span className={styles.iconBox}>
          <Icon slug={service.icon} size={24} />
        </span>
        <div>
          <Title className={styles.title}>{service.title}</Title>
          {categoryTitle && <p className={styles.category}>{categoryTitle}</p>}
        </div>
      </header>

      <div className={styles.highlight}>
        <p className={styles.highlight_title}>{service.headline}</p>
        <p className={styles.description}>{service.description}</p>
      </div>

      {whoNeedsIt.length > 0 && (
        <section className={styles.section}>
          <SectionTitle className={styles.sectionTitle}>Кому нужен</SectionTitle>
          <ul className={styles.checkList}>
            {whoNeedsIt.map((item) => (
              <li key={item.id} className={styles.checkItem}>
                <Icon slug="check" size={20} className={styles.checkIcon} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {steps.length > 0 && (
        <section className={styles.section}>
          <SectionTitle className={styles.sectionTitle}>Как это работает</SectionTitle>
          <ol className={styles.steps}>
            {steps.map((step, i) => (
              <li key={step.id} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <div>
                  <StepTitle className={styles.stepTitle}>{step.title}</StepTitle>
                  <p className={styles.stepText}>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {requirements.length > 0 && (
        <section className={styles.section}>
          <SectionTitle className={styles.sectionTitle}>Что нужно для подключения</SectionTitle>
          <ul className={styles.reqList}>
            {requirements.map((item) => (
              <li key={item.id} className={styles.reqItem}>
                {item.text}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <section className={styles.section}>
          <SectionTitle className={styles.sectionTitle}>Часто берут вместе</SectionTitle>
          <div className={styles.relatedGrid}>{renderRelated(related)}</div>
        </section>
      )}

      <footer>
        <RequestButton className={styles.ctaButton} source={`${source}:${service.slug}`}>
          {service.popup?.ctaText ?? 'Подключить сервис'}
        </RequestButton>
      </footer>
    </article>
  )
}
